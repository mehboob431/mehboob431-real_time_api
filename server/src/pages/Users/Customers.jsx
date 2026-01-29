import React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Toolbar, Sort, Filter } from '@syncfusion/ej2-react-grids';

import { Header } from '../../components';

const Customers = () => {
  const selectionsettings = { persistSelection: true };
  const toolbarOptions = ['Delete'];
  const editing = { allowDeleting: true, allowEditing: true };



  const customerData = [
    { Name: 'Sunil Joshi', Email: 'sunil@gmail.com', ProjectName: 'Elite Admin', Status: 'Active', Weeks: 11, Budget: '$3.9k', Location: 'India', CustomerId: 1037 },
    { Name: 'Andrew McDownli', Email: 'andrew@gmail.cc', ProjectName: 'Real Homes WP Theme', Status: 'Pending', Weeks: 19, Budget: '$24.5k', Location: 'USA', CustomerId: 1038 },
    { Name: 'Christopher Jamil', Email: 'jamil@gmail.com', ProjectName: 'MedicalPro WP Theme', Status: 'Completed', Weeks: 34, Budget: '$16.5k', Location: 'USA', CustomerId: 1039 },
    { Name: 'Michael', Email: 'michael@gmail.cc', ProjectName: 'Weekly WP Theme', Status: 'Cancel', Weeks: 34, Budget: '$16.5k', Location: 'USA', CustomerId: 1040 }
  ];

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Customers" />
      <GridComponent
        dataSource={customerData}
        allowPaging={true}
        pageSettings={{ pageCount: 4 }}
        enableHover={false}
        selectionSettings={selectionsettings}
        toolbar={toolbarOptions}
        editSettings={editing}
        allowSorting={true}
      >
        <ColumnsDirective>
          <ColumnDirective type='checkbox' width='50' />
          <ColumnDirective field='Name' headerText='Name' width='150' />
          <ColumnDirective field='ProjectName' headerText='Project Name' width='150' />
          <ColumnDirective
            field='Status'
            headerText='Status'
            width='100'
            template={statusTemplate}
            textAlign='Center'
          />

          <ColumnDirective field='Weeks' headerText='Weeks' width='100' textAlign='Right' />
          <ColumnDirective field='Budget' headerText='Budget' width='100' textAlign='Right' />
          <ColumnDirective field='Location' headerText='Location' width='120' />
          <ColumnDirective field='CustomerId' headerText='Customer ID' width='100' textAlign='Right' />
        </ColumnsDirective>
        <Inject services={[Page, Selection, Toolbar, Edit, Sort, Filter]} />
      </GridComponent>
    </div>
  );
};

const statusTemplate = (props) => {
  const statusStyle = {
    'Active': { backgroundColor: 'green', color: 'white', padding: '5px', borderRadius: '50px', textAlign: 'center' },
    'Pending': { backgroundColor: 'yellow', color: 'black', padding: '5px', borderRadius: '50px', textAlign: 'center' },
    'Completed': { backgroundColor: 'green', color: 'white', padding: '5px', borderRadius: '50px', textAlign: 'center' },
    'Cancel': { backgroundColor: 'red', color: 'white', padding: '5px', borderRadius: '50px', textAlign: 'center' },
  };

  return (
    <div style={statusStyle[props.Status]}>
      <span>{props.Status}</span>
    </div>
  );
};




export default Customers;


