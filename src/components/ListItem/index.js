import React from "react";
import { Grid, Button } from "@material-ui/core";
import Item from "./Item";
import "./listItem.scss";

export default function ListItem({ dataList }) {
    return (
        <div className="listContainer">
            <Grid container alignItems="stretch">
                {dataList.map((data) => (
                    <Grid key={data.id} item xs={12} sm={6} md={3} lg={2}>
                        <Item data={data} />
                    </Grid>
                ))}
            </Grid>
            <div className="list-more-btn">
                <Button className="more-btn">Xem thêm</Button>
            </div>
        </div>
    );
}
