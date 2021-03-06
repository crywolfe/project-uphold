import axios, { AxiosResponse } from 'axios';
import inquirer from 'inquirer';
import { RequestEnum } from './enums/RequestEnum';
import { IAsk } from './interfaces/IAsk';
import { IOscillation } from './interfaces/IOscillation';
import { IBotConfig } from './interfaces/IBotConfig';
import { Sequelize } from 'sequelize';
import { Price } from './models/prices'

export const sequelize = new Sequelize('uphold_data', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres',
});

sequelize.authenticate().then(() => {
    console.log("DATABASE IS AUTHENTICATED AND ACTIVE");
    setPair();

}).catch((err) => {
    console.log(err);
})

let botConfig = {};
const previousAsks: Map<string, IAsk> = new Map();
const currentAsks: Map<string, IAsk> = new Map();
const oscillations: Map<string, IOscillation> = new Map();
const pairs: string[] = [];
const notInitial: RequestEnum = RequestEnum.NOT_INITIAL;

const questions = [
    {
        name: 'pair',
        type: 'input',
        message: 'Enter the pair as XXX-XXX, e.g. BTC-USD: ',
        default: 'BTC-USD',
        validate: (pair: string) => {
            const pairValidated = /^([A-Z]){3}[-]([A-Z]){3}/.test(pair);
            if (!pairValidated) {
                console.info(`\n Please re-enter in a validate format.\n`);
            }
            return pairValidated;
        }
    },
    {
        name: 'oscillation',
        type: 'number',
        message: 'What percentage change would you like to be notified?, default is .01% ',
        default: .01,
        validate: (oscillation: number) => {
            const numberValidated = /^\d{0,10}(\.\d{1,4})?/.test(oscillation.toString());
            if (!numberValidated) {
                console.info(`\n Please re-enter in a valid format such as 0.XX, .X, X.\n`);
            }
            return numberValidated;
        }
    },
    {
        name: 'interval',
        type: 'number',
        message: 'How often do you want prices retrieved? \n' +
        '(Must be greater than or equal to 5 seconds and only the latest value is used), default is 5',
        default: 5
    },
    {
        name: 'askAgain',
        type: 'confirm',
        message: 'Would you like to add any more pairs? (hit enter for yes)',
        default: true
    }

];

const setPair = (): void => {
    
    inquirer.prompt(questions).then((answers) => {
        pairs.push(answers.pair);
        oscillations[answers.pair] = answers.oscillation
        if (answers.askAgain) {
            setPair();
        } else {
            botConfig = {
                timeOfConfig: new Date(Date.now()),
                pairs,
                oscillations,
                interval: answers.interval             
            };
            getRequest(RequestEnum.INITIAL, pairs, null);
            runInterval(RequestEnum.NOT_INITIAL, pairs, oscillations, answers.interval);
        }
    });
}

const getRequest = async (RequestEnum: RequestEnum, pairs: string[], oscillations: Map<string, IOscillation>): Promise<void> => {

    const requests = buildRequests(pairs);

    await axios.all(requests).then(axios.spread((...responses) => {
        responses.forEach((response) => {
            const pairName = response.request.path.slice(-7);

            currentAsks[pairName] = +response.data.ask;

            if (notInitial === RequestEnum) {
                const output = priceChange(pairName, previousAsks[pairName], currentAsks[pairName], oscillations[pairName]);
                console.info({output})
            }
            
            previousAsks[pairName] = currentAsks[pairName]

        })
    })).catch(err => {
        console.log(err);
    });
}

export const priceChange = ((pairName: string, previousAsk: number, currentAsk: number, oscillation: number): string => {
    if (currentAsk > previousAsk && Math.abs(1 - currentAsk / previousAsk) > oscillation/100) {
        persistRow(pairName, currentAsk, botConfig);
        return `Alert - Price Change of ${pairName} Ask Up ?????? more than ${oscillation}% from ${previousAsk} to ${currentAsk}`;
    } else if (currentAsk < previousAsk && Math.abs(1 - previousAsk / currentAsk) > oscillation/100) {
        persistRow(pairName, currentAsk, botConfig);
        return `Alert - Price Change of ${pairName} Ask Down ?????? more than ${oscillation}% from ${previousAsk} to ${currentAsk}`;
    }
    return ''
})

const persistRow = async (pairName: string, currentAsk: number, botConfig: IBotConfig): Promise<void> => {
    let row = await Price.create({
        pair_name: pairName,
        ask_price: currentAsk,
        bot_config: botConfig
    })
    console.log({row: row.toJSON()});
}

const runInterval = (RequestEnum: RequestEnum, pairs: string[], oscillations: Map<string, IOscillation>, interval: number): void => {
    const intervalInMS = interval*1000;
    
    setInterval(() => {
        getRequest(RequestEnum, pairs, oscillations);
    }, intervalInMS)
};

const buildRequests = (pairs: string[]): Promise<AxiosResponse<any>>[] => {
    const requests: Promise<AxiosResponse<any>>[] = [];

    pairs.forEach((pair: string) => {
        requests.push(axios.get(`https://api.uphold.com/v0/ticker/${pair}`));

    });
    return requests;
}

