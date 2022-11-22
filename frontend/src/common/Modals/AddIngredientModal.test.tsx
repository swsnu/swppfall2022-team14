import { fireEvent, render, screen } from "@testing-library/react";
import AddIngredientModal from "./AddIngredientModal";

const setIsOpen = jest.fn()

jest.mock('react-modal', () => (props: { className: any, isOpen: boolean, onRequestClose: any, children: React.ReactNode }) => {
    props.onRequestClose()
    if (props.isOpen) return (<div data-testid={`spyModal_opened`}>{props.children}</div>)
    else return (<div data-testid={`spyModal_closed`}></div>)
})


describe("<AddIngredientModal />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render modal closed without errors", () => {
        const { container } = render(
            <AddIngredientModal isOpen={false} setIsOpen={setIsOpen} user_id={4} />
        );
        expect(setIsOpen).toBeCalledWith(false)
        screen.getByTestId("spyModal_closed");
    });

    it("should render modal opened without errors", () => {
        const { container } = render(
            <AddIngredientModal isOpen={true} setIsOpen={setIsOpen} user_id={4} />
        );
        screen.getByTestId("spyModal_opened");
        screen.getByText("재료 추가");
    });

    it("should handle close modal button", () => {
        render(
            <AddIngredientModal isOpen={true} setIsOpen={setIsOpen} user_id={4} />
        );
        const button = screen.getByText("X")
        fireEvent.click(button)
        expect(setIsOpen).toBeCalledWith(false)
    });
})