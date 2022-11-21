import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CocktailItemType } from "../../store/slices/cocktail/cocktail";
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
}

describe("<ShortComment />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render comment without errors", () => {
        render(<ShortComment id={1} cocktail={standard_cocktail1_item} content="COMMENT1"/>); 
        screen.getByText("COMMENT1")
    });

    it("should handle comment on standard click", async () => {
        const { container } = render(<ShortComment id={1} cocktail={standard_cocktail1_item} content="COMMENT1"/>); 
        const element = container.getElementsByClassName("box")[0]
        fireEvent.click(element)
        await waitFor(() => {expect(mockNavigate).toBeCalledWith("/standard/1")})
    });

    it("should handle comment on standard click", async () => {
        const { container } = render(<ShortComment id={1} cocktail={custom_cocktail1_item} content="COMMENT1"/>); 
        const element = container.getElementsByClassName("box")[0]
        fireEvent.click(element)
        await waitFor(() => {expect(mockNavigate).toBeCalledWith("/custom/2")})
    })
})