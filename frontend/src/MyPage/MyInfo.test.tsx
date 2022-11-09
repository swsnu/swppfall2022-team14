import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import MyInfo from "./MyInfo";


describe("<Ingr />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", () => {
        render( <MyInfo/> );
        screen.getByText("Name");
        screen.getByText("Email");
        screen.getByText("Info");
    });
});