import axios from 'axios';
import { key, proxy } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }
    
    async getRecipe() {
        //const url = `${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`;
        const url = 'https://raw.githubusercontent.com/ArunasNorvaisa/saukstas/master/recipe.json';
        try {
            const res = await axios(url);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch(error) {
            console.log(error);
        };
    }
 
    //We calculate cooking time, making rather VERY shallow
    //estimate that for every 3 ingredients we need 15 minutes
    calcTime() {
        const numberOfIngredients = this.ingredients.length;
        const periods = Math.ceil(numberOfIngredients / 3);
        this.time = periods * 15;
    }
    
    //Again, we shallowly assume that every recipe has 4 servings
    calcServings() {
        this.servings = 4;
    }
}