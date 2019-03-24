import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }
    
    async getResults() {
/*        const key = '80446f14fc7beddbcd9232a8a883e6b3';
        const url = `https://cors-anywhere.herokuapp.com
                    https://www.food2fork.com/api/search
                    ?key=${key}&q=${this.query}`;*/
        const url = 'https://my-json-server.typicode.com/ArunasNorvaisa/saukstas'
        try {
            const res = await axios(url);
            this.result = res.data.recipes;
            console.log(result);
        } catch(error) {
            console.log(error);
        };
    }
}