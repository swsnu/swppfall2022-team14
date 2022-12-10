import React from 'react';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import Item from "./Item";
import { CardProps } from '@mui/material';

// eslint-disable-next-line react/display-name
jest.mock("@mui/material/Card/Card", () => (props:CardProps) => (
    <div data-testid={"item"} onClick={props.onClick}/>
));

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

describe("<Item />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", () => {
        render(    
            <MemoryRouter initialEntries={['/standard']}>
                <Routes>
                    <Route path="/:type" element={<Item id={1} name="ITEM1" image="IMAGE1" rate={0} tags={["TAG1"]} is_bookmarked={true} type="ST"/>}/>
                </Routes>
            </MemoryRouter>
        );
        const card = screen.getByTestId("item")
        fireEvent.click(card)
        expect(mockNavigate).toHaveBeenCalledWith("/standard/1");
    });
})