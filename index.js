import express from "express";
import axios from "axios";


const app = express();
const port = 3000;
const API_URL = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
app.use(express.static("public"));
let ingredients = "";


app.get("/", async (req, res) => {
    try {
        const result = await axios.get(API_URL);

        // FILTER OF INGREDIENTS
        const ingredientsFiltered = Object.keys(result.data.drinks[0])
            .filter((key) => key.includes("strIngredient"))
            .reduce((obj, key) => {
                return Object.assign(obj, {
                    [key]: result.data.drinks[0][key]
                });
            }, {});

        //DELETE OF ALL NULLS FROM OBJECT
        Object.keys(ingredientsFiltered).forEach(key => {
            if (ingredientsFiltered[key] == null) {
                delete ingredientsFiltered[key];
            }
        });

        //TRANSFORMATION FROM OBJECT TO ARRAY
        let arrayOfIngredientsFiltered = Object.values(ingredientsFiltered);

        // FILTER OF MEASURUMENTS
        const measurementsFiltered = Object.keys(result.data.drinks[0])
            .filter((key) => key.includes("strMeasure"))
            .reduce((obj, key) => {
                return Object.assign(obj, {
                    [key]: result.data.drinks[0][key]
                });
            }, {});

        //DELETE OF ALL NULLS FROM OBJECT
        Object.keys(measurementsFiltered).forEach(key => {
            if (measurementsFiltered[key] == null) {
                delete measurementsFiltered[key];
            }
        });

        //TRANSFORMATION FROM OBJECT TO ARRAY
        let arrayOfMeasurementsFiltered = Object.values(measurementsFiltered);

        let ingredientsMixed = arrayOfMeasurementsFiltered.map((x, i) => [x + " of " + arrayOfIngredientsFiltered[i]]);

        res.render("index.ejs", {
            randomCocktailImage: result.data.drinks[0].strDrinkThumb,
            randomAlcoholic: result.data.drinks[0].strAlcoholic,
            randomCocktailName: result.data.drinks[0].strDrink,
            randomIngredients: arrayOfIngredientsFiltered,
            randomMeasurements: arrayOfMeasurementsFiltered,
            randomIngredientsMixed: ingredientsMixed,
            randomInstructions: result.data.drinks[0].strInstructions,
            randomGlass: result.data.drinks[0].strGlass
        });

    } catch (error) {
        res.status(500);
    }
})


app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})