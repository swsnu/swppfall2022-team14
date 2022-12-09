import { Dispatch, SetStateAction, useEffect, useState } from "react"
import React from 'react';
import { Filterparam } from "../InitPage";
import { Divider, Button, Stack, FormGroup, TextField, Typography } from '@mui/material';

interface ParamList {
    name: string;
    label: string;
}

interface FilterType {
    type: "typeOne"|"typeTwo"|"typeThree";
    name: string;
}

interface ThemeList {
    label: string,
    filters: FilterType[]
}

export interface Iprops {
    setUrlParams: Dispatch<SetStateAction<Filterparam>>
    onClickSearch: () => void
    input: string
    setInput: Dispatch<SetStateAction<string>>
}



const Filter = (prop: Iprops) => {

    const themeList: ThemeList[] = [
        {label: "Theme1", filters: [{type: "typeOne", name:"CL"}, {type:"typeThree", name:"weak"}]}, 
        {label: "Theme2", filters: [{type: "typeOne", name:"TP"}, {type:"typeThree", name:"medium"}, {type:"typeTwo", name:"LONG"}]}
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
    const [availableOnly, setAvailableOnly] = useState<boolean>(false)
    const url_params = {
        type_one: typeParam.typeOne,
        type_two: typeParam.typeTwo,
        type_three: typeParam.typeThree,
        available_only: availableOnly
    }
    const onTypeClick = (param_type: string, type_name: string) => {
        if(param_type === "typeOne"){
            const param = typeParam.typeOne
            if (!param.includes(type_name)){
                setTypeParam({...typeParam, typeOne:param.concat(type_name)})
            }
            else
                setTypeParam({...typeParam, typeOne:param.filter(value => value != type_name)})
        }else if(param_type === "typeTwo"){
            const param = typeParam.typeTwo
            if (!param.includes(type_name))
                setTypeParam({...typeParam, typeTwo:param.concat(type_name)})
            else
                setTypeParam({...typeParam, typeTwo:param.filter(value => value != type_name)})
        }else{
            const param = typeParam.typeThree
            if (param.includes(type_name))
                setTypeParam({...typeParam, typeThree:[]})
            else
                setTypeParam({...typeParam, typeThree:[type_name]})
        }
    }

    const onThemeClick = (filters: ThemeList) => {
        const typeOne = [];
        const typeTwo = [];
        let typeThree = "";
        for(const filter of filters.filters){
            if(filter.type === "typeOne"){
                typeOne.push(filter.name)
            }else if(filter.type === "typeTwo"){
                typeTwo.push(filter.name)
            }else{
                typeThree = filter.name
            }
        }
        setTypeParam({
            typeOne: typeOne,
            typeTwo: typeTwo,
            typeThree: [typeThree],
        })
    }

    useEffect(() => prop.setUrlParams(url_params), [typeParam, availableOnly])

    return (
        <Stack spacing={2} alignItems='flex-start' sx={{ pl: 3 }}>
            <Stack direction="row" spacing={1}>
                <Typography variant="body1">
                    Theme
                </Typography>
                <Divider sx={{ pl: 1 }} orientation="vertical" flexItem />
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
                { title: "Type 1", list: typeOneList  , typeParamList: typeParam.typeOne  , name: "typeOne"   },
                { title: "Type 2", list: typeTwoList  , typeParamList: typeParam.typeTwo  , name: "typeTwo"   },
                { title: "Type 3", list: typeThreeList, typeParamList: typeParam.typeThree, name: "typeThree" },
            ].map((filter) => {
                return (
                    <Stack direction="row" key={filter.title} spacing={1}>
                        <Typography variant="body1">
                            {filter.title}
                        </Typography>
                        <Divider sx={{ pl: 1 }} orientation="vertical" flexItem />
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
            <Stack direction="row" spacing={1}>
                <Typography variant="body1">
                    재료 기반 검색
                </Typography>
                <Divider sx={{ pl: 1 }} orientation="vertical" flexItem />
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
            <Stack spacing={2} alignItems="stretch">
                <TextField 
                    label="추가 검색어" variant="standard" value={prop.input} onChange={(e) => prop.setInput(e.target.value)} 
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
                <Button variant="contained" onClick={prop.onClickSearch} 
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
        </Stack >
    )
}


export default Filter