import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '.';
import { IBotConfig } from '../interfaces/IBotConfig';

interface PriceAttributes {
    id: number,
    pair_name: string,
    ask_price: number,
    bot_config: IBotConfig,
}

interface PriceCreationAttributes extends Optional<PriceAttributes, 'id'> {
}

interface PriceInstance extends Model<PriceAttributes, PriceCreationAttributes>, PriceAttributes {
    createdAt?: Date;
    updatedAt?: Date;
}

export const Price = sequelize.define<PriceInstance>('Price', 
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        pair_name: {
            type: DataTypes.STRING
        },
        ask_price: {
            type: DataTypes.REAL
        },
        bot_config: {
            type: DataTypes.JSON
        }
    },
    {
        tableName: 'prices',
        timestamps: false
    }
)
