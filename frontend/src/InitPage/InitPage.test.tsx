import { getMockStore } from "../test-utils/mock";
import { CocktailInfo } from "../store/slices/cocktail/cocktail";
import { CommentInfo } from "../store/slices/comment/comment";
import { IngredientInfo } from "../store/slices/ingredient/ingredient";

const stubCocktailInitialState: CocktailInfo = {
    cocktailList: [
        {
            id: 1,
            name: "COCKTAIL_NAME_1",
            image: "COCKTAIL_IMAGE_1",
            type: "ST",
            tags: ["TAG_1", "TAG_2"],
            author_id: null,
            rate: 0,
        },
        {
            id: 2,
            name: "COCKTAIL_NAME_2",
            image: "COCKTAIL_IMAGE_2",
            type: "ST",
            tags: ["TAG_1"],
            author_id: null,
            rate: 0,
        },
        {
            id: 3,
            name: "COCKTAIL_NAME_3",
            image: "COCKTAIL_IMAGE_3",
            type: "CS",
            tags: ["TAG_2"],
            author_id: 1,
            rate: 0,
        },
        {
            id: 4,
            name: "COCKTAIL_NAME_4",
            image: "COCKTAIL_IMAGE_4",
            type: "CS",
            tags: ["TAG_1", "TAG_2"],
            author_id: 2,
            rate: 0,
        },
    ],
    cocktailItem: null,
    itemStatus: "loading",
    listStatus: "loading",
};

const stubCommentInitialState: CommentInfo = {
    commentList: [],
    commentItem: null,
    state: null,
};

const stubIngredientInitialState: IngredientInfo = {
    ingredientList: [],
    ingredientItem: null,
    itemStatus: "loading",
    listStatus: "loading",
};

const mockStore = getMockStore(
    {
        cocktail: stubCocktailInitialState,
        comment: stubCommentInitialState,
        ingredient: stubIngredientInitialState,
    }
);