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
    
    parseIngredients() {
        const newIngredients = this.ingredients.map(el => {
            //Units to convert FROM
            const unitsLong = [
                'tablespoons',
                'tablespoon',
                'ounces',
                'ounce',
                'teaspoons',
                'teaspoon',
                'cups',
                'pounds'
            ];
            //Units to convert TO
            const unitsShort = [
                'tbsp',
                'tbsp',
                'oz',
                'oz',
                'tsp',
                'tsp',
                'cup',
                'pound'
            ];
            //1. Uniform units
            let ingredient = el.toLowerCase();
            //We replace any string from unitsLong with it's
            //counterpart in unitsShort - if found
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });
            
            //2. Remove parentheses
            //copied from https://stackoverflow.com/questions/4292468/
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
            
            //3. Parse units, count and ingredient
            //First, we're splitting ingr. list into an array
            const ingredientsArray = ingredient.split(' ');
            //Now we loop through ingredientsArray looking if anything
            //from unitsShort is there and returning it's index, if there            
            //Example '4 1/2 cups of coffee' returns 2
            //(new stuff from ES7/8 - exiting!!!   :P )
            const unitIndex = ingredientsArray.findIndex(element => unitsShort.includes(element));
            
            let objIngredients;
            if(unitIndex > -1) {
                //There are units
                
                //following line returns [4, 1/2] from '4 1/2 cups of coffee':
                const arrCount = ingredientsArray.slice(0, unitIndex);                
                let count;
                if(arrCount.length === 1) {//If ingr. list only has 1 number
                    count = ingredientsArray[0]; // => 4
                    //Sometimes API begins w/ smthg like '1-1/2 teaspoons', so:
                    count = eval(count.replace("-", "+"));
                } else {
                    count = eval(arrCount.join('+')); // 4 + 1/2 = 5;
                }
                objIngredients = {
                    count: count,
                    unit: ingredientsArray[unitIndex],
                    ingredient: ingredientsArray.slice(unitIndex + 1).join(' ')
                };
            } else if(parseInt(ingredientsArray[0], 10)) {
                //There are no units but first element is a number
                objIngredients = {
                    count: parseInt(ingredientsArray[0], 10),
                    unit: '',
                    ingredient: ingredientsArray.slice(1).join(' ')
                };                
            } else if(unitIndex === -1) {
                //There is no unit or number in first position
                objIngredients = {
                    count: '',
                    unit: '',
                    ingredient: ingredient
                };
            }
            
            return objIngredients;            
        });
        this.ingredients = newIngredients;
    }
}