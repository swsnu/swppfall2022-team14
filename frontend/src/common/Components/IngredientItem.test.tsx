import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import IngredientItem from "./IngredientItem";
import React from 'react';

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
}));

describe("<IngredientItem />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render my ingredient without errors", () => {
        render(
            <IngredientItem image="IMAGE1" name="INGREDIENT1" ABV={10} id={1} user_id={1} my_item={true} />
        );
        screen.getByText("INGREDIENT1")
    });

    it("should render not in my ingredient without errors", () => {
        render(
            <IngredientItem image="IMAGE1" name="INGREDIENT1" ABV={10} id={1} user_id={1} my_item={false} />
        );
        const element = screen.queryByText("X")
        expect(element).toBeNull()
    });

    it("should handle click item", async () => {
        const { container } = render(
            <IngredientItem image="IMAGE1" name="INGREDIENT1" ABV={10} id={1} user_id={1} my_item={true} />
        );
        const element = container.getElementsByClassName("item")[0]
        fireEvent.click(element)
        await waitFor(() => { expect(mockNavigate).toBeCalledWith("/ingredient/1") })
    })

    it("should handle delete my item", async () => {
        render(
            <IngredientItem image="IMAGE1" name="INGREDIENT1" ABV={10} id={1} user_id={1} my_item={true} />
        );
        const element = screen.getByText("X")
        fireEvent.click(element)

        await waitFor(() => { expect(mockDispatch).toBeCalled() })
    })
})