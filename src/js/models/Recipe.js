import axios from 'axios';
import { key, proxy } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }
    
    async getRecipe() {
/*        const url = `${proxy}
                    https://www.food2fork.com/api/get
                    ?key=${key}&q=${this.id}`;*/
        const url = 'https://raw.githubusercontent.com/ArunasNorvaisa/saukstas/master/db.json'
        try {
            const res = await axios(url);
            this.result = res.data.recipes;
        } catch(error) {
            console.log(error);
        };
    }
    }
}