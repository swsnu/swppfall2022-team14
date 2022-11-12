import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import Ingr from "./Ingr";

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
        const { container } = render(    
            <MemoryRouter initialEntries={['/ingr']}>
                <Routes>
                    <Route path="/:type" element={<Ingr id={1} name="INGREDIENT1" image="IMAGE1"/>}/>
                </Routes>
            </MemoryRouter>
        );
        const element = container.getElementsByClassName("list-item");
        expect(element).toHaveLength(1);
    });

    it("should handle click ingredient detail", () => {
        const { container } = render(    
            <MemoryRouter initialEntries={['/ingr']}>
                <Routes>
                    <Route path="/:type" element={<Ingr id={1} name="INGREDIENT1" image="IMAGE1"/>}/>
                    <Route path="/:type/:id" element={<Ingr id={1} name="INGREDIENT1" image="IMAGE1"/>}/>
                </Routes>
            </MemoryRouter>
        );
 
        const element = container.getElementsByClassName("list-item");
        fireEvent.click(element[0]);
        expect(mockNavigate).toHaveBeenCalledWith("/ingr/1");

    });
})