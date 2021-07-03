import express from 'express';
import axios, { AxiosResponse } from 'axios';
// import {priceChange2} from './service/service';
import worker from 'worker_threads'
import inquirer from 'inquirer';
// maybe use ramda for fx programming compose...

const DELAY = 5000

const app = express();
const PORT = 3000;

let previousAsk = 0;
let response;

let pairs = [];


app.get('/', (req, res) => {
    res.send('Landing!');
});

app.listen(PORT, () => {
    // console.log(`Listening on http://localhost:${PORT}`);
});

const questions = [
    {
        name: 'pair',
        type: 'input',
        message: 'Enter the pair as XXX-XXX, e.g. BTC-USD: ',
        validate: (pair: string) => {
            const pairValidated = /^([A-Z]){3}[-]([A-Z]){3}/.test(pair);
            console.info(`\n Please re-enter in a validate format.\n`);
            return pairValidated;
        }
    },
    {
        name: 'oscillationPercentage',
        type: 'number',
        message: 'What percentage change would you like to be notified?, default is .01% ',
        default: .0001,
        validate: (oscillationPercentage: number) => {
            const numberValidated = /^\d{0,10}(\.\d{1,4})?/.test(oscillationPercentage.toString());
            console.info(`\n Please re-enter in a valid format such as 0.XX, .X, X.\n`);
            return numberValidated;
        }
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
        if (answers.askAgain) {
            setPair();
        } else {
            getInitialRequest(pairs);
            // getRequest(pairs, answers.oscillationPercentage/100);
            // priceChange2;
    
            // runInterval(pairs, answers.oscillationPercentage/100);
        }
    });
}
setPair();

interface IRequest {
    pair: string,
    request: Promise<AxiosResponse<any>>
}
const getInitialRequest = async (pairs: string[]): Promise<void> => {
    const requests: Promise<AxiosResponse<any>>[] = [];
    // const requests2: IRequest[] = []
    // const requestMap: Map<string, Promise<AxiosResponse<any>>> = new Map();

    pairs.forEach((pair: string) => {
        // requestMap[pair] = axios.get(`https://api.uphold.com/v0/ticker/${pair}`)
        // requests2.push({pair, request: axios.get(`https://api.uphold.com/v0/ticker/${pair}`)})
        requests.push(axios.get(`https://api.uphold.com/v0/ticker/${pair}`))

    })
    const responses = await axios.all(requests).then(axios.spread((...responses) => {
        responses.forEach((response) => {
            const pairNameFromPath = response.request.path.slice(-7);
            console.log({responseData: response.data})
            console.log(`initial price for ${pairNameFromPath} is ${+response.data.ask}`);

        })
    })).catch(err => {
        console.log(err);
    });
    // const res = await reqAll;
    // const req = axios.get(`https://api.uphold.com/v0/ticker/${pair}`);
    // const res = await req;
    // response = res.data;

    // const currentAsk = +response.ask;
    // previousAsk = currentAsk;

}

const getRequest = async (pair: string, oscillationPercentage: number): Promise<void> => {
    const req = axios.get(`https://api.uphold.com/v0/ticker/${pair}`);
    const res = await req;
    
    console.info(res.data);
    response = res.data;
    const currentAsk = +response.ask;

    priceChange(previousAsk, currentAsk, oscillationPercentage);

    previousAsk = currentAsk;
}

const priceChange = ((previousAsk: number, currentAsk: number, oscillationPercentage: number): void => {
    if (currentAsk > previousAsk && currentAsk / previousAsk > oscillationPercentage/100) {
        console.info(`Alert - Price Change of Ask Up ⬆️ than ${oscillationPercentage*100}% from ${previousAsk} to ${currentAsk}`);
    } else if (currentAsk < previousAsk && previousAsk / currentAsk > oscillationPercentage/100) {
        console.info(`Alert - Price Change of Ask Down ⬇️ more than ${oscillationPercentage*100}% from ${previousAsk} to ${currentAsk}`);
    }
})

const runInterval = (pair: string, oscillationPercentage: number): void => {
    setInterval(() => {
        getRequest(pair, oscillationPercentage);
    }, DELAY)
};

export default app;
