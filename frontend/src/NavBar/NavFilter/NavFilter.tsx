import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import './NavFilter.scss'
import { Button, Stack, FormGroup, TextField, Typography } from '@mui/material';

interface ParamList {
    name: string;
    label: string;
}

interface FilterType {
    type: "typeOne" | "typeTwo" | "typeThree";
    name: string;
}

interface ThemeList {
    label: string,
    filters: FilterType[]
}

export interface Iprops {
    type: string
}

const NavFilter = (prop: Iprops) => {
    const themeList: ThemeList[] = [
        { label: "Theme1", filters: [{ type: "typeOne", name: "클래식" }, { type: "typeThree", name: "weak" }] },
        { label: "Theme2", filters: [{ type: "typeOne", name: "트로피컬" }, { type: "typeThree", name: "medium" }, { type: "typeTwo", name: "롱 드링크" }] }
    ]
    const typeOneList: ParamList[] = [{ name: "클래식", label: "클래식" }, { name: "트로피컬", label: "트로피컬" }]
    const typeTwoList: ParamList[] = [{ name: "롱 드링크", label: "롱드링크" }, { name: "숏 드링크", label: "숏드링크" }, { name: "샷", label: "샷" }]
    const typeThreeList: ParamList[] = [{ name: "weak", label: "15도 이하" }, { name: "medium", label: "15 ~ 30도" }, { name: "strong", label: "30 ~ 40도" }, { name: "extreme", label: "40도 이상" }]
    const [typeParam, setTypeParam] = useState<
        {
            typeOne: string[],
            typeTwo: string[],
            typeThree: string[],
        }>({
            typeOne: [],
            typeTwo: [],
            typeThree: [],
        })
    const [input, setInput] = useState('')
    const [availableOnly, setAvailableOnly] = useState<boolean>(false)

    const url_params = {
        type_one: typeParam.typeOne,
        type_two: typeParam.typeTwo,
        type_three: typeParam.typeThree,
        available_only: availableOnly
    }

    const request_param = { filter_param: url_params, name_param: input }
    const navigate = useNavigate()
    const onClickSearch = () => {
        // TODO : give params with filter information
        if (prop.type === 'ST') navigate(`/standard`,
            { state: request_param }
        )
        else if (prop.type === 'CS') navigate(`/custom`, { state: request_param })
        else if (prop.type === 'IG') navigate(`/ingredient`)
    }

    const onTypeClick = (param_type: string, type_name: string) => {
        if (param_type === "typeOne") {
            const param = typeParam.typeOne
            if (!param.includes(type_name)) {
                setTypeParam({ ...typeParam, typeOne: param.concat(type_name) })
            }
            else
                setTypeParam({ ...typeParam, typeOne: param.filter(value => value != type_name) })
        } else if (param_type === "typeTwo") {
            const param = typeParam.typeTwo
            if (!param.includes(type_name))
                setTypeParam({ ...typeParam, typeTwo: param.concat(type_name) })
            else
                setTypeParam({ ...typeParam, typeTwo: param.filter(value => value != type_name) })
        } else if (param_type === "typeThree") {
            const param = typeParam.typeThree
            if (param.includes(type_name))
                setTypeParam({ ...typeParam, typeThree: [] })
            else
                setTypeParam({ ...typeParam, typeThree: [type_name] })
        }
    }

    const onThemeClick = (filters: ThemeList) => {
        const typeOne = [];
        const typeTwo = [];
        let typeThree = "";
        for (const filter of filters.filters) {
            if (filter.type === "typeOne") {
                typeOne.push(filter.name)
            } else if (filter.type === "typeTwo") {
                typeTwo.push(filter.name)
            } else {
                typeThree = filter.name
            }
        }
        setTypeParam({
            typeOne: typeOne,
            typeTwo: typeTwo,
            typeThree: [typeThree],
        })
    }
    const onKeyPress = (e: { key: string; }) => {
        if (e.key == 'Enter') {
            onClickSearch();
        }
    };

    if (prop.type === 'IG') {
        return (
            <Stack
                spacing={2}
                sx={{
                    textAlign: 'left',
                    p: 2,
                    bgcolor: 'primary.dark',
                    borderRadius: 4,
                }}>
                <TextField onKeyPress={onKeyPress}
                    label="추가 검색어" variant="standard" value={input} onChange={(e) => setInput(e.target.value)}
                    sx={{
                        '& label.Mui-focused': {
                            color: 'secondary.light',
                        },
                        '& .MuiInput-underline:after': {
                            borderBottomColor: 'secondary.light',
                        },
                        '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                                borderColor: 'secondary.light',
                            },
                        },
                    }}
                />
                <Button variant="contained" onClick={onClickSearch}
                    sx={{
                        bgcolor: 'primary.dark',
                        borderRadius: 5,
                        boxShadow: 3,
                        '&:hover': {
                            backgroundColor: 'action.hover',
                            boxShadow: 2,
                        },
                    }}
                >
                    검색
                </Button>
            </Stack>
        )
    }
    else {
        return (
            <Stack
                spacing={2}
                sx={{
                    textAlign: 'left',
                    p: 2,
                    bgcolor: 'primary.dark',
                    borderRadius: 4,
                }}>
                <TextField onKeyPress={onKeyPress}
                    label="추가 검색어" variant="standard" value={input} onChange={(e) => setInput(e.target.value)}
                    sx={{
                        '& label.Mui-focused': {
                            color: 'secondary.light',
                        },
                        '& .MuiInput-underline:after': {
                            borderBottomColor: 'secondary.light',
                        },
                        '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                                borderColor: 'secondary.light',
                            },
                        },
                    }}
                />
                <Stack spacing={1}>
                    <Typography variant="body1">
                        Theme
                    </Typography>
                    <FormGroup row sx={{ gap: 1 }}>
                        {themeList.map((type) => {
                            return (
                                <Button
                                    key={type.label}
                                    size="small"
                                    sx={{ bgcolor: 'primary.dark', borderRadius: 5, px: 1, py: 0.2, textAlign: 'center' }}
                                    onClick={() => onThemeClick(type)}
                                >
                                    <Typography variant="caption" color='text.primary'>
                                        {type.label}
                                    </Typography>
                                </Button>
                            )
                        })}
                    </FormGroup>
                </Stack>
                {[
                    { title: "Type 1", list: typeOneList, typeParamList: typeParam.typeOne, name: "typeOne" },
                    { title: "Type 2", list: typeTwoList, typeParamList: typeParam.typeTwo, name: "typeTwo" },
                    { title: "Type 3", list: typeThreeList, typeParamList: typeParam.typeThree, name: "typeThree" },
                ].map((filter) => {
                    return (
                        <Stack key={filter.title} spacing={1}>
                            <Typography variant="body1">
                                {filter.title}
                            </Typography>
                            <FormGroup row sx={{ gap: 1 }}>
                                {filter.list.map((type) => {
                                    return (
                                        <Button
                                            key={type.label}
                                            size="small"
                                            sx={{ bgcolor: filter.typeParamList.includes(type.name) ? 'primary.light' : 'primary.dark', borderRadius: 5, px: 1, py: 0.2, textAlign: 'center' }}
                                            onClick={() => onTypeClick(filter.name, type.name)}
                                        >
                                            <Typography variant="caption" color='text.primary'>
                                                {type.label}
                                            </Typography>
                                        </Button>
                                    )
                                })}
                            </FormGroup>
                        </Stack>
                    )
                })}
                <Stack spacing={1}>
                    <Typography variant="body1">
                        재료 기반 검색
                    </Typography>
                    <FormGroup row sx={{ gap: 1 }}>
                        <Button
                            size="small"
                            sx={{ bgcolor: availableOnly ? 'primary.light' : 'primary.dark', borderRadius: 5, px: 1, py: 0.2, textAlign: 'center' }}
                            onClick={() => setAvailableOnly(!availableOnly)}
                        >
                            <Typography variant="caption" color='text.primary'>
                                만들 수 있는 칵테일만
                            </Typography>
                        </Button>
                    </FormGroup>
                </Stack>
                <Button variant="contained" onClick={onClickSearch}
                    sx={{
                        bgcolor: 'primary.dark',
                        borderRadius: 5,
                        boxShadow: 3,
                        '&:hover': {
                            backgroundColor: 'action.hover',
                            boxShadow: 2,
                        },
                    }}
                >
                    검색
                </Button>
            </Stack>
        )
    }
}

export default NavFilter