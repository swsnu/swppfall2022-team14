import { MemoryRouter, Route, Routes } from "react-router";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils/mock";
import { CocktailInfo } from "../../store/slices/cocktail/cocktail";
import { CommentInfo } from "../../store/slices/comment/comment";
import { IngredientInfo } from "../../store/slices/ingredient/ingredient";
import InitMyLiqourModal from "./InitMyLiquorModal";

const stubCocktailInitialState: CocktailInfo = {
    cocktailList: [],
    cocktailItem: null,
    itemStatus: "loading",
    listStatus: "loading",
}

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

jest.mock("react-modal", () => (props: {className: any, isOpen: boolean, onRequestClose: any, children: React.ReactNode}) => {
    props.onRequestClose()
    if (props.isOpen) return (
        <div data-testid={"spyModal_opened"}>
            {props.children}
        </div>
    )
    else return <div data-testid={"spyModal_closed"} />
});

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
}));

const renderInitMyLiqourModal = () => {
    renderWithProviders(
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<InitMyLiqourModal isOpen={true} setIsOpen={ jest.fn() }/>} />
            </Routes>
        </MemoryRouter>,
        {
            preloadedState: {
                cocktail: stubCocktailInitialState,
                comment: stubCommentInitialState,
                ingredient: stubIngredientInitialState,
            },
        }
    );
};

describe("<InitMyLiquorModal />", () => {
    it("should render InitMyLiquorModal", async () => {
        renderInitMyLiqourModal();
        await screen.findByText("내 술 목록");
    });
    it("should close InitMyLiquorModal when close button clicked", async () => {
        renderInitMyLiqourModal();
        const closeButton = screen.getByText("X");
        fireEvent.click(closeButton);
    });
});