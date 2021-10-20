/* SOLUTION */

const findEmployeeByName = (name, array) => {
  return array.filter((employee) => employee.name === name)[0];
};

const findManagerFor = (empl, array) => {
  return array.filter((employee) => employee.id === empl.managerId)[0];
};

const findCoworkersFor = (empl, array) => {
  return array.filter(
    (employee) =>
      employee.managerId === empl.managerId && employee.id !== empl.id
  );
};

const findManagementChainForEmployee = (empl, array) => {
  const mgmtChain = [];
  //base case, employee with no mgr returns empty array
  if (!empl.managerId) {
    return [];
  } else {
    let manager = findManagerFor(empl, array);
    return findManagementChainForEmployee(manager, array).concat(manager);
  }
};

const findDirectReportsFor = (empl, array) => {
  return array.filter((employee) => empl.id === employee.managerId);
};

//I feel like I should be using recursion here but this worked :shrug:
//Should this be returning an array? The "tests" indicate not, but I feel like it makes no sense to have the top employee be the first object itself.
//What if there are several top level mgrs?
const generateManagementTree = (emplList) => {
  emplList.forEach((employee) => {
    employee.reports = [];
    let mgr = findManagerFor(employee, emplList);
    if (mgr) {
      mgr.reports.push(employee);
    }
  });
  // return the highest level employee (ie the one without a manager)
  return emplList.filter((employee) => !employee.managerId)[0];
};

function displayManagementTree(emplTree) {
  let treeDisplay = "";
  treeDisplay += `${emplTree.name}`;
  if (emplTree.reports.length > 0) {
    for (const empl of emplTree.reports) {
      let descendentsDisplay = displayManagementTree(empl);
      treeDisplay = treeDisplay + "\n" + "-" + descendentsDisplay;
    }
  }
  return treeDisplay;
}

/* TESTS */

const employees = [
  { id: 1, name: "moe" },
  { id: 2, name: "larry", managerId: 1 },
  { id: 4, name: "shep", managerId: 2 },
  { id: 3, name: "curly", managerId: 1 },
  { id: 5, name: "groucho", managerId: 3 },
  { id: 6, name: "harpo", managerId: 5 },
  { id: 8, name: "shep Jr.", managerId: 4 },
  { id: 99, name: "lucy", managerId: 1 },
];

const spacer = (text) => {
  if (!text) {
    return console.log("");
  }
  const stars = new Array(5).fill("*").join("");
  console.log(`${stars} ${text} ${stars}`);
};

spacer("findEmployeeByName Moe");
// given a name and array of employees, return employee
console.log(findEmployeeByName("moe", employees)); //{ id: 1, name: 'moe' }
spacer("");

spacer("findManagerFor Shep Jr.");
//given an employee and a list of employees, return the employee who is the manager
console.log(
  findManagerFor(findEmployeeByName("shep Jr.", employees), employees)
); //{ id: 4, name: 'shep', managerId: 2 }
spacer("");

spacer("findCoworkersFor Larry");

//given an employee and a list of employees, return the employees who report to the same manager
console.log(
  findCoworkersFor(findEmployeeByName("larry", employees), employees)
); /*
  [ { id: 3, name: 'curly', managerId: 1 },
    { id: 99, name: 'lucy', managerId: 1 } ]
  */

spacer("");

spacer("findManagementChain for moe");
//given an employee and a list of employees, return a the management chain for that employee. The management chain starts from the employee with no manager with the passed in employees manager
console.log(
  findManagementChainForEmployee(
    findEmployeeByName("moe", employees),
    employees
  )
); //[  ]
spacer("");

spacer("findManagementChain for shep Jr.");
console.log(
  findManagementChainForEmployee(
    findEmployeeByName("shep Jr.", employees),
    employees
  )
); /*
  [ { id: 1, name: 'moe' },
    { id: 2, name: 'larry', managerId: 1 },
    { id: 4, name: 'shep', managerId: 2 }]
  */
spacer("");

spacer("generateManagementTree");
//given a list of employees, generate a tree like structure for the employees, starting with the employee who has no manager. Each employee will have a reports property which is an array of the employees who report directly to them.
console.log(JSON.stringify(generateManagementTree(employees), null, 2));
/*
  {
    "id": 1,
    "name": "moe",
    "reports": [
      {
        "id": 2,
        "name": "larry",
        "managerId": 1,
        "reports": [
          {
            "id": 4,
            "name": "shep",
            "managerId": 2,
            "reports": [
              {
                "id": 8,
                "name": "shep Jr.",
                "managerId": 4,
                "reports": []
              }
            ]
          }
        ]
      },
      {
        "id": 3,
        "name": "curly",
        "managerId": 1,
        "reports": [
          {
            "id": 5,
            "name": "groucho",
            "managerId": 3,
            "reports": [
              {
                "id": 6,
                "name": "harpo",
                "managerId": 5,
                "reports": []
              }
            ]
          }
        ]
      },
      {
        "id": 99,
        "name": "lucy",
        "managerId": 1,
        "reports": []
      }
    ]
  }
  */
spacer("");

spacer("displayManagementTree");
//given a tree of employees, generate a display which displays the hierarchy
console.log(displayManagementTree(generateManagementTree(employees))); /*
  moe
  -larry
  --shep
  ---shep Jr.
  -curly
  --groucho
  ---harpo
  -lucy
  */
