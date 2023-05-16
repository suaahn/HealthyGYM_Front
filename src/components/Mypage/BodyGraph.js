import "./BodyGraph.css";
import React, { useEffect, useState } from "react";
import { Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis } from "recharts";
import axios from '../../utils/CustomAxios';

export default function BodyGraph({ token }) {

    const [dayA, setDayA] = useState("");
    const [dayB, setDayB] = useState("");
    const [weightA, setWeightA] = useState("");
    const [musclemassA, setMusclemassA] = useState("");
    const [bodyfatmassA, setBodyfatmassA] = useState("");
    const [weightB, setWeightB] = useState("");
    const [musclemassB, setMusclemassB] = useState("");
    const [bodyfatmassB, setBodyfatmassB] = useState("");

    useEffect(() => {
        axios
            .post("http://localhost:3000/bodycomlist", token)
            .then((response) => {
                const { list } = response.data;
                const [firstItem, ...restItems] = list;
                const lastItem = restItems.pop();

                setWeightA(firstItem.weight);
                setMusclemassA(firstItem.musclemass);
                setBodyfatmassA(firstItem.bodyfatmass);
                setDayA(firstItem.uploaddate.slice(0, 10));
                setWeightB(lastItem.weight);
                setMusclemassB(lastItem.musclemass);
                setBodyfatmassB(lastItem.bodyfatmass);
                setDayB(lastItem.uploaddate.slice(0, 10));
            })
            .catch((error) => {
                console.log(error);
            });
    }, [token]);

    const data = [
        {
            subject: "체중",
            A: weightA,
            B: weightB,
            fullMark: 200,
        },
        {
            subject: "골격근량",
            A: musclemassA*2,
            B: musclemassB*2,
            fullMark: 200,
        },
        {
            subject: "체지방량",
            A: bodyfatmassA*2,
            B: bodyfatmassB*2,
            fullMark: 200,
        },
    ];

    return (
        <div className="mypage-graph-01">
            <RadarChart outerRadius={70} width={300} height={175} data={data}>
                <PolarGrid stroke="#eee" />
                <PolarAngleAxis dataKey="subject" angle={0} />
                <Radar name={dayA} dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.4} />
                <Radar name={dayB} dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.5} />
                <Legend />
            </RadarChart>
        </div>
    );
}
