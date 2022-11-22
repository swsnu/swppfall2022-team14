import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Item from "./Item";
import React from 'react';

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

describe("<Item />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render cocktail without errors", () => {
        render(        
            <Item image="IMAGE1" name="ST_COCKTAIL" rate={0} id={1} type="ST" tags={["TAG1"]}/>
        );
        screen.getByText("ST_COCKTAIL");
        screen.getByText("#TAG1");
    });

    it("should handle click standard item", async () => {
        const { container } = render(        
            <Item image="IMAGE1" name="ST_COCKTAIL" rate={0} id={1} type="ST" tags={[]}/>
        );
        const element = container.getElementsByClassName("item")[0]
        fireEvent.click(element)
        await waitFor(() => {expect(mockNavigate).toBeCalledWith("/standard/1")});
    });

    it("should handle click custom item", async () => {
        const { container } = render(        
            <Item image="IMAGE1" name="CS_COCKTAIL" rate={0} id={2} type="CS" tags={[]}/>
        );
        const element = container.getElementsByClassName("item")[0]
        fireEvent.click(element)
        await waitFor(() => {expect(mockNavigate).toBeCalledWith("/custom/2")});
    });
})