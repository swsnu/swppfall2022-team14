import {Divider, Stack} from "@mui/material";
import React from "react";
import NavBar from "../NavBar/NavBar";
import {Route, Routes} from "react-router-dom";
import ListPage from "../ListPage/ListPage";
import EditCustomPage from "../EditCustomPage/EditCustomPage";
import CreateCustomPage from "../CreateCustomPage/CreateCustomPage";
import IngredientDetailPage from "../ItemDetailPage/IngredientDetailPage";
import ItemDetailPage from "../ItemDetailPage/ItemDetailPage";
import MyPage from "../MyPage/MyPage";


const MainPage = () => {

    return(
        <Stack direction="row" justifyContent="flex-start" divider={<Divider orientation="vertical" flexItem />}>
            <NavBar />
            <Routes>
                <Route path="/:type" element={<ListPage />} />
                <Route path="/custom/:id/edit" element={<EditCustomPage />} />
                <Route path='/custom/create' element={<CreateCustomPage />} />
                <Route path="/ingredient/:id" element={<IngredientDetailPage />} />
                <Route path="/:type/:id" element={<ItemDetailPage />} />
                <Route path="/mypage" element={<MyPage />} />
            </Routes>
        </Stack>
    )
}

export default MainPage