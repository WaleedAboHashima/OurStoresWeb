import { Box, Button, IconButton, Tooltip } from "@mui/material";
import Header from "./../../../components/Header";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { fetchSrOrders } from './../../../apis/Orders/SrOrders';
import  ArchiveOutlinedIcon  from '@mui/icons-material/ArchiveOutlined';

const SrOrders = () => {
  // Variables
  const dispatch = useDispatch();
  const State = useSelector(state => state.allSrOrders)
  const columns = [
    {field: "id" , headerName: "ID"},
    {field: "SR UserName" , headerName: "Name", valueGetter: (data) => data.row.SR.username},
    {field: "SR Email" , headerName: "Name", valueGetter: (data) => data.row.SR.email, flex: 1},
    {field: "totalPrice" , headerName: "Total Price", flex : 1},
    {field: "productsQuantity" , headerName: "Quantity", flex: 1},
    {field: "date" , headerName: "DATE", flex: 1},
    {
      field: "actions", headerName: "Actions", renderCell: ({ row: { _id } }) => {
        return(
        <Tooltip title="Archive" placement="right">
          <IconButton onClick={() => console.log(_id)}>
            <ArchiveOutlinedIcon />
          </IconButton>
          </Tooltip>
        )
      }, flex: 1},
  ];

  //Functions


  useEffect(() => {
    dispatch(fetchSrOrders());
  }, [dispatch])
  return (
    <Box m="20px">
      <Header title="Sr Orders" subtitle="Sr Orders Are Listed Below" />
      <Box marginTop="10px" height="70vh">
        {State.data.orders ? (<DataGrid rows={State.data.orders.filter(o => !o.archived ).map((o, index) => ({
          id: index + 1,
          ...o
        }))} columns={columns} components= {{Toolbar : GridToolbar }} getRowId={row => row._id} />) : (<DataGrid rows={[]} columns={[]}/>)}
      </Box>
    </Box>
  );
};

export default SrOrders;
