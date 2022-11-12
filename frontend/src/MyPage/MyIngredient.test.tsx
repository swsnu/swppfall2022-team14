import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Dispatch, SetStateAction } from "react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { CocktailInfo } from "../store/slices/cocktail/cocktail";
import { CommentInfo } from "../store/slices/comment/comment";
import { IngredientInfo, IngredientType } from "../store/slices/ingredient/ingredient";
import { getMockStore } from "../test-utils/mock";
import MyIngredient from "./MyIngredient";

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
}));

jest.mock("../common/Components/IngredientItem", () => (prop:Pick<IngredientType, "image" | "name" | "ABV" | "id">) => (
    <div data-testid={`spyIngredient_${prop.id}`}>
    </div>
));

jest.mock("../common/Modals/AddIngredientModal", () => (prop:{isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>}) => (
    <div data-testid={`spyModal`}>
    </div>
));

const emptyCocktaiState: CocktailInfo = {
    cocktailList: [],
    cocktailItem: null,
    itemStatus: "success",
    listStatus: "success",
}

const emptyCommentState: CommentInfo = {
    commentList: [],
    commentItem: null,
    state: null,
}
const ingredient: IngredientType = {
    id: 1,
    name: "INGREDIENT1",
    image: "IMAGE1",
    ABV: 0,
    price: 0,
    introduction: "INTRODUCTION1",
}

const ingredientState: IngredientInfo = {
    ingredientList: [ingredient],
    ingredientItem: null,
    itemStatus: "success",
    listStatus: "success",
}

let mockStore = getMockStore({cocktail: emptyCocktaiState, ingredient: ingredientState, comment: emptyCommentState});

describe("<MyIngredient />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", () => {
        render( <Provider store={mockStore}><MyIngredient/></Provider>);
        screen.getByTestId("spyIngredient_1");
    });

    it("should handle add modal", async () => {
        render( <Provider store={mockStore}><MyIngredient/></Provider>);
        const addButton = screen.getByText("Add");
        fireEvent.click(addButton)
        await waitFor(() => screen.getByTestId("spyIngredient_1"));
    });
});