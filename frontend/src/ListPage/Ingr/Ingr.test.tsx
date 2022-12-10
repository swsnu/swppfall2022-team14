import React from 'react';
import { CardProps } from "@mui/material";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import Ingr from "./Ingr";

// eslint-disable-next-line react/display-name
jest.mock("@mui/material/Card/Card", () => (props:CardProps) => (
    <div data-testid={"ingr_item"} onClick={props.onClick}/>
));

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

describe("<Ingr />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", () => {
        render(    
            <MemoryRouter initialEntries={['/ingr']}>
                <Routes>
                    <Route path="/:type" element={<Ingr id={1} name="INGREDIENT1" image="IMAGE1"/>}/>
                </Routes>
            </MemoryRouter>
        );
        const card = screen.getByTestId("ingr_item")
        fireEvent.click(card)
        expect(mockNavigate).toHaveBeenCalledWith("/ingr/1");
    });
})