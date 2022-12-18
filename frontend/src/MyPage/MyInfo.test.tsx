import { ButtonProps, InputProps } from "@mui/material";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { CocktailInfo } from "../store/slices/cocktail/cocktail";
import { CommentInfo } from "../store/slices/comment/comment";
import { IngredientInfo } from "../store/slices/ingredient/ingredient";
import { RateInfo } from "../store/slices/rate/rate";
import { UserInfo } from "../store/slices/user/user";
import { getMockStore } from "../test-utils/mock";
import MyInfo from "./MyInfo";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

jest.mock("@mui/material/Input/Input", () => (props: InputProps) => (
    <div>
        <input onChange={props.onChange} data-testid={'password_input'} />
        {props.endAdornment}
    </div>
));


const loggedInState: UserInfo = {
    user: {
        id: "1",
        username: "USERNAME",
        password: null,
        nickname: null,
        intro: null,
        profile_img: null,
    },
    token: "TOKEN",
    isLogin: true
}

const rateState: RateInfo = {
    rate: { id: 1, user_id: 1, cocktail_id: 1, score: 1 },
    myRate: null
}

const cocktaiState: CocktailInfo = {
    cocktailList: [],
    cocktailItem: null,
    itemStatus: "success",
    listStatus: "success",
}

const ingredientState: IngredientInfo = {
    ingredientList: [],
    myIngredientList: [],
    ingredientItem: null,
    itemStatus: "success",
    listStatus: "success",
    recommendIngredientList: [],
    availableCocktails: []
}

const commentState: CommentInfo = {
    commentList: [],
    commentItem: null,
    state: null,
}

const mockLoggedInStore = getMockStore({ cocktail: cocktaiState, ingredient: ingredientState, comment: commentState, user: loggedInState, rate: rateState });

describe("<MyInfo />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", () => {
        const mockDispatch = jest.fn();
        jest.mock("react-redux", () => ({
            ...jest.requireActual("react-redux"),
            useDispatch: () => mockDispatch,
        }));

        render(
        <Provider store={mockLoggedInStore}>
            <MyInfo open={true} onClose={jest.fn()} />
        </Provider> 
        );
        screen.getByText("기존 비밀번호");
        screen.getByText("새로운 비밀번호");
    });

    it("should handle to change password correctly", async () => {
        jest.spyOn(axios, "put").mockResolvedValueOnce({});
        render(
        <Provider store={mockLoggedInStore}>
            <MyInfo open={true} onClose={jest.fn()} />
        </Provider> 
        );
        const pw_input = screen.getAllByTestId("password_input");
        const show_password_button = screen.getAllByTestId("show_password_button")[0];
        fireEvent.click(show_password_button)

        expect(pw_input).toHaveLength(4)
        const origin_pw = pw_input[1]
        const new_pw = pw_input[2]
        const confirm_pw = pw_input[3]
        fireEvent.change(origin_pw, { target: { value: "PASSWORD1" } })
        fireEvent.change(new_pw, { target: { value: "PASSWORD2" } })
        fireEvent.change(confirm_pw, { target: { value: "PASSWORD2" } })

        const confirm_button = screen.getByText("수정")
        fireEvent.click(confirm_button)

        await waitFor(() => expect(mockNavigate).toBeCalledWith('../'))
    });

    it("should handle to change password incorrectly", async () => {
        jest.spyOn(axios, "put").mockRejectedValueOnce({response: {data: {"code": 10}}});
        render(
        <Provider store={mockLoggedInStore}>
            <MyInfo open={true} onClose={jest.fn()} />
        </Provider> 
        );
        const pw_input = screen.getAllByTestId("password_input");
        expect(pw_input).toHaveLength(4)
        const origin_pw = pw_input[1]
        const new_pw = pw_input[2]
        const confirm_pw = pw_input[3]
        fireEvent.change(origin_pw, { target: { value: "PASSWORD1" } })
        fireEvent.change(new_pw, { target: { value: "PASSWORD2" } })
        fireEvent.change(confirm_pw, { target: { value: "PASSWORD2" } })
        const confirm_button = screen.getByText("수정")
        fireEvent.click(confirm_button)

        await waitFor(() => screen.getByText("원래 비밀번호가 일치하지 않습니다."))
    });

    it("should handle to change password incorrectly with another code", async () => {
        jest.spyOn(axios, "put").mockRejectedValueOnce({response: {data: {"code": 20}}});
        render(
        <Provider store={mockLoggedInStore}>
            <MyInfo open={true} onClose={jest.fn()} />
        </Provider> 
        );
        const pw_input = screen.getAllByTestId("password_input");
        expect(pw_input).toHaveLength(4)
        const origin_pw = pw_input[1]
        const new_pw = pw_input[2]
        const confirm_pw = pw_input[3]
        fireEvent.change(origin_pw, { target: { value: "PASSWORD1" } })
        fireEvent.change(new_pw, { target: { value: "PASSWORD2" } })
        fireEvent.change(confirm_pw, { target: { value: "PASSWORD2" } })
        const confirm_button = screen.getByText("수정")
        fireEvent.click(confirm_button)
    });

    it("should handle wrong type password", async () => {
        render(
        <Provider store={mockLoggedInStore}>
            <MyInfo open={true} onClose={jest.fn()} />
        </Provider> 
        );
        const pw_input = screen.getAllByTestId("password_input");
        expect(pw_input).toHaveLength(4)
        const new_pw = pw_input[2]
        fireEvent.change(new_pw, { target: { value: "PASS" } })


        await waitFor(() => screen.getByText("비밀번호의 형식을 다시 확인해주세요"))
    });

    it("should handle different new password and confirm", async () => {
        render(
        <Provider store={mockLoggedInStore}>
            <MyInfo open={true} onClose={jest.fn()} />
        </Provider> 
        );
        const pw_input = screen.getAllByTestId("password_input");
        expect(pw_input).toHaveLength(4)
        const new_pw = pw_input[2]
        const confirm_pw = pw_input[3]
        fireEvent.change(new_pw, { target: { value: "PASSWORD2" } })
        fireEvent.change(confirm_pw, { target: { value: "PASSWORD3" } })
        await waitFor(() => screen.getByText("새로운 비밀번호와 일치하지 않습니다."))
    });
});