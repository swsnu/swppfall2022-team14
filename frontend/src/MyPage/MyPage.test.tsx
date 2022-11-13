import { fireEvent, render, screen } from "@testing-library/react";
import MyPage from "./MyPage";

jest.mock("./MyIngredient", () => () => (
    <div data-testid={`spyMyIngredient`}>
    </div>
));

jest.mock("./MyBookmark", () => () => (
    <div data-testid={`spyMyBookmark`}>
    </div>
));

jest.mock("./MyCustomCocktail", () => () => (
    <div data-testid={`spyMyCustomCocktail`}>
    </div>
));

jest.mock("./MyComment", () => () => (
    <div data-testid={`spyMyComment`}>
    </div>
));

jest.mock("./MyInfo", () => () => (
    <div data-testid={`spyMyInfo`}>
    </div>
));

jest.mock("../NavBar/NavBar", () => () => (
    <div data-testid={`spyNavBar`}>
    </div>
));

describe("<MyPage />", () => {
    it("should render without errors", () => {
        render( <MyPage/> ); 
        const navBar = screen.getAllByTestId("spyNavBar");
        expect(navBar).toHaveLength(1);
        const myIngredient = screen.getAllByTestId("spyMyIngredient");
        expect(myIngredient).toHaveLength(1);
    });

    it("should handle view change button", () => {
        render( <MyPage/> ); 
        const infoButton = screen.getByText("Info");
        fireEvent.click(infoButton);
        const myInfo = screen.getAllByTestId("spyMyInfo");
        expect(myInfo).toHaveLength(1);
    });
});