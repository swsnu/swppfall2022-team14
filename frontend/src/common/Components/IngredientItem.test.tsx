import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import IngredientItem from "./IngredientItem";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

describe("<IngredientItem />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render ingredient without errors", () => {
        render(        
            <IngredientItem image="IMAGE1" name="INGREDIENT1" ABV={10} id={1}/>
        );
        screen.getByText("INGREDIENT1")
    });

    it("should handle click item", async () => {
        const { container } = render(        
            <IngredientItem image="IMAGE1" name="INGREDIENT1" ABV={10} id={1}/>
        );
        const element = container.getElementsByClassName("item")[0]
        fireEvent.click(element)
        await waitFor(() => {expect(mockNavigate).toBeCalledWith("/ingredient/1")})
    })
})