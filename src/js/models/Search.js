import axios from 'axios';
import { key, proxy } from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        //const url = `${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`;
        const url = 'https://raw.githubusercontent.com/ArunasNorvaisa/saukstas/master/db.json'
        try {
            const res = await axios(url);
            this.result = res.data.recipes;
        } catch(error) {
            alert(error);
        };
    }
}
