import axios from "axios";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { fireEvent, render, screen } from "@testing-library/react";
import { getMockStore, renderWithProviders } from "../test-utils/mock";
import { CocktailInfo, CocktailItemType } from "../store/slices/cocktail/cocktail";
import { CommentInfo } from "../store/slices/comment/comment";
import { IngredientInfo } from "../store/slices/ingredient/ingredient";
import styles from '.../common/Components/Item.module.scss'
import InitPage from "./InitPage";

jest.mock("../common/Components/Item", () => (prop: Pick<CocktailItemType, "image" | "name" | "rate" | "type" | "id" | "tags">) => (
    <div data-testid="spyCocktail">
        <img className="item__image" src={prop.image} />
        <div className="item__name">{prop.name}</div>
        <div className="item__rate">{prop.rate} / 5점</div>
        <div className="item__tags">
            {prop.tags.map(tag => { return <div className="item__tag" key={tag}>#{tag} </div> })}
        </div>
    </div>
));

const cocktailList = [
    {
        id: 1,
        name: "COCKTAIL_NAME_1",
        image: "COCKTAIL_IMAGE_1",
        type: "ST",
        tags: ["TAG_1", "TAG_2"],
        author_id: null,
        rate: 5,
    },
    {
        id: 2,
        name: "COCKTAIL_NAME_2",
        image: "COCKTAIL_IMAGE_2",
        type: "ST",
        tags: ["TAG_1"],
        author_id: null,
        rate: 4,
    },
    {
        id: 3,
        name: "COCKTAIL_NAME_3",
        image: "COCKTAIL_IMAGE_3",
        type: "CS",
        tags: ["TAG_2"],
        author_id: 1,
        rate: 3,
    },
];

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

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
}));

const renderInitPage = (isStandard: Boolean=true) => {
    renderWithProviders(
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<InitPage />} />
            </Routes>
        </MemoryRouter>,
        {
            preloadedState: {
                cocktail: {
                    cocktailList: 
                        isStandard ? 
                        cocktailList.filter((cocktail) => cocktail.type === "ST") :
                        cocktailList.filter((cocktail) => cocktail.type === "CS"),
                    cocktailItem: null,
                    itemStatus: "loading",
                    listStatus: "loading",
                },
                comment: stubCommentInitialState,
                ingredient: stubIngredientInitialState,
            },
        }
    );
};

describe("<InitPage />", () => {
    it("should render InitPage", async () => {
        renderInitPage();
        await screen.findByText("로그인")
    });
    it("should render standard cocktails", async () => {
        jest.spyOn(axios, "get").mockImplementationOnce(() => {
            return Promise.resolve({
                data: [
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
                ],
            });
        });
        renderInitPage();
        await screen.findByText("COCKTAIL_NAME_1");
        const cocktails = screen.getAllByTestId("spyCocktail");
        expect(cocktails).toHaveLength(2);
    });
    it("should render custom cocktails when custom button clicked", async () => {
        renderInitPage(false);
        const customButton = screen.getByText("커스텀");
        fireEvent.click(customButton);
        await screen.findByText("COCKTAIL_NAME_3");
        const cocktails = screen.getAllByTestId("spyCocktail");
        expect(cocktails).toHaveLength(1);
    });
    it("should render filter when filter button clicked", async () => {
        renderInitPage(false);
        const filterButton = screen.getByText("FILTER");
        fireEvent.click(filterButton);
        await screen.findByText("Type 1");
    });
});