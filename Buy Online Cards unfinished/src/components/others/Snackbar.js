// import React, { useContext, useEffect } from "react";
// import Button from '@material-ui/core/Button';
// import { SnackbarProvider, useSnackbar } from 'notistack';

// const snackbar_context_info = {
//   message: 'testing',
//   variant: 'none'
// };
// export  const snackbar_context = React.createContext(snackbar_context_info);


// function MyApp() {

//     let snackbar_context_object = useContext(snackbar_context);
    
//     const { enqueueSnackbar } = useSnackbar();

//     useEffect(() => { 
//       console.log('snackbar useEffect')
//       let variant = snackbar_context_object.variant
//        // variant could be success, error, warning, info, or default
//        if(variant === 'none'){
//         enqueueSnackbar('This is a success message!');
//       }
//       enqueueSnackbar('This is a success message!', { variant });
//     }, [snackbar_context_object])




//   // return (
//   //   <React.Fragment>
//   //     <Button onClick={handleClick}>Show snackbar</Button>
//   //     <Button onClick={handleClickVariant('success')}>Show success snackbar</Button>
//   //   </React.Fragment>
//   // );
// }

