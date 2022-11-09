import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import Item from "./Item";

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
        const { container } = render(    
            <MemoryRouter initialEntries={['/ingr']}>
                <Routes>
                    <Route path="/:type" element={<Item id={1} name="ITEM1" image="IMAGE1" rate={0} tags={["TAG1"]} type="ST"/>}/>
                </Routes>
            </MemoryRouter>
        );
        const element = container.getElementsByClassName("list-item");
        expect(element).toHaveLength(1);
        screen.getByText("#TAG1")
    });

    it("should handle click ingredient detail", () => {
        const { container } = render(    
            <MemoryRouter initialEntries={['/standard']}>
                <Routes>
                    <Route path="/:type" element={<Item id={1} name="ITEM1" image="IMAGE1" rate={0} tags={["TAG1"]} type="ST"/>}/>
                    <Route path="/:type/:id" element={<Item id={1} name="ITEM1" image="IMAGE1" rate={0} tags={["TAG1"]} type="ST"/>}/>
                </Routes>
            </MemoryRouter>
        );
 
        const element = container.getElementsByClassName("list-item");
        fireEvent.click(element[0]);
        expect(mockNavigate).toHaveBeenCalledWith("/standard/1");

    });
})