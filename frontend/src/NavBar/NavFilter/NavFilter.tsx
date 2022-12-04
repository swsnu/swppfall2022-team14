import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import './NavFilter.scss'
import { Button, Stack, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, TextField, Typography } from '@mui/material';

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
        { label: "Theme1", filters: [{ type: "typeOne", name: "CL" }, { type: "typeThree", name: "weak" }] },
        { label: "Theme2", filters: [{ type: "typeOne", name: "TP" }, { type: "typeThree", name: "medium" }, { type: "typeTwo", name: "LONG" }] }
    ]
    const typeOneList: ParamList[] = [{ name: "CL", label: "클래식" }, { name: "TP", label: "트로피컬" }]
    const typeTwoList: ParamList[] = [{ name: "LONG", label: "롱드링크" }, { name: "SHORT", label: "숏드링크" }, { name: "SHOT", label: "샷" }]
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
        console.log(typeParam)
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
                <TextField 
                    label="검색" variant="standard" value={input} onChange={(e) => setInput(e.target.value)} 
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
                            backgroundColor: 'secondary.main',
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
                <TextField 
                    label="검색" variant="standard" value={input} onChange={(e) => setInput(e.target.value)} 
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
                <FormControl component="fieldset" variant="standard">
                    <FormLabel component="legend">Theme</FormLabel>
                    <FormGroup row>
                        {themeList.map((type) => {
                            return (
                                <FormControlLabel
                                    key={type.label}
                                    label={
                                        <Typography sx={{ fontSize: 14, ml: -0.5 }}>
                                            {type.label}
                                        </Typography>
                                    }
                                    sx={{ mb: -1 }}
                                    control={
                                        <Checkbox
                                            sx={{ '& .MuiSvgIcon-root': { fontSize: 14 } }}
                                            onChange={() => onThemeClick(type)}
                                        />
                                    }
                                />
                            )
                        })}
                    </FormGroup>
                </FormControl>
                {[
                    { title: "Type 1", list: typeOneList  , typeParamList: typeParam.typeOne  , name: "typeOne"   },
                    { title: "Type 2", list: typeTwoList  , typeParamList: typeParam.typeTwo  , name: "typeTwo"   },
                    { title: "Type 3", list: typeThreeList, typeParamList: typeParam.typeThree, name: "typeThree" },
                ].map((filter) => {
                    return (
                        <FormControl key={filter.title} component="fieldset" variant="standard">
                            <FormLabel component="legend">{filter.title}</FormLabel>
                            <FormGroup row>
                                {filter.list.map((type) => {
                                    return (
                                        <FormControlLabel
                                            key={type.label}
                                            label={
                                                <Typography sx={{ fontSize: 14, ml: -0.5 }}>
                                                    {type.label}
                                                </Typography>
                                            }
                                            sx={{ mb: -1 }}
                                            control={
                                                <Checkbox
                                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 14 } }}
                                                    checked={filter.typeParamList.includes(type.name)}
                                                    onChange={() => onTypeClick(filter.name, type.name)}
                                                />
                                            }
                                        />
                                    )
                                })}
                            </FormGroup>
                        </FormControl>
                    )
                })}
                <FormControl component="fieldset" variant="standard">
                    <FormLabel component="legend">재료 기반 검색</FormLabel>
                    <FormGroup row>
                        <FormControlLabel
                            label={
                                <Typography sx={{ fontSize: 14, ml: -0.5 }}>
                                    만들 수 있는 칵테일만
                                </Typography>
                            }
                            sx={{ mb: -1 }}
                            control={
                                <Checkbox
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 14 } }}
                                    defaultChecked={availableOnly}
                                    onChange={() => setAvailableOnly(!availableOnly)}
                                />
                            }
                        />
                    </FormGroup>
                </FormControl>
                <Button variant="contained" onClick={onClickSearch} 
                    sx={{
                        bgcolor: 'primary.dark', 
                        borderRadius: 5,
                        boxShadow: 3,
                        '&:hover': {
                            backgroundColor: 'secondary.main',
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