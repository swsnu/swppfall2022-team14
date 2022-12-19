import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { CocktailItemType } from "../../store/slices/cocktail/cocktail";
import { renderWithProviders } from "../../test-utils/mock";
import ShortComment from "./ShortComment";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

const standard_cocktail1_item: CocktailItemType = {
    id: 1,
    name: "ST_COCKTAIL1",
    image: "IMAGE1",
    type: "ST",
    tags: [],
    author_id: null,
    rate: 0,
    is_bookmarked: false,
    ABV: 10,
    price_per_glass: 10,
};

const custom_cocktail1_item: CocktailItemType = {
    id: 2,
    name: "CS_COCKTAIL1",
    image: "IMAGE1",
    type: "CS",
    tags: [],
    author_id: 1,
    rate: 0,
    is_bookmarked: false,
    ABV: 10,
    price_per_glass: 10,
}

describe("<ShortComment />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render comment without errors", () => {
        render(
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<ShortComment id={1} cocktail={standard_cocktail1_item} content="COMMENT1" updated_at={new Date()}/> } />
            </Routes>
        </MemoryRouter>); 
        screen.getByText("COMMENT1")
    });

    it("should handle comment on standard click", async () => {
        const { container } = render(
            <MemoryRouter>
                <Routes>
                    <Route path="/" element={<ShortComment id={1} cocktail={standard_cocktail1_item} content="COMMENT1" updated_at={new Date()}/> } />
                </Routes>
            </MemoryRouter>);
        const element = screen.getByText("ST_COCKTAIL1")
        fireEvent.click(element)
    });

    it("should handle comment on standard click", async () => {
        const { container } = render(
            <MemoryRouter>
                <Routes>
                    <Route path="/" element={<ShortComment id={1} cocktail={custom_cocktail1_item} content="COMMENT1" updated_at={new Date()}/> } />
                </Routes>
            </MemoryRouter>);
        const element = screen.getByText("CS_COCKTAIL1")
        fireEvent.click(element)
    })
})