const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  console.log("🗑️  Clearing existing data...");
  await prisma.order.deleteMany();
  await prisma.lot.deleteMany();
  await prisma.variety.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.user.deleteMany();

  // Create password hash
  const passwordHash = await bcrypt.hash("password123", 10);

  // Create Users
  console.log("👥 Creating users...");

  // 1 Administrator
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: passwordHash,
      mobile: "9876543210",
      role: "Administrator",
      remarks: "System administrator",
    },
  });

  // 2 Managers
  const manager1 = await prisma.user.create({
    data: {
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      password: passwordHash,
      mobile: "9876543211",
      role: "Manager",
      areaOfResponsibility: "North Region",
      remarks: "Experienced manager",
    },
  });

  const manager2 = await prisma.user.create({
    data: {
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      password: passwordHash,
      mobile: "9876543212",
      role: "Manager",
      areaOfResponsibility: "South Region",
      remarks: "Quality control specialist",
    },
  });

  // 4 Read-Only Managers
  const readOnlyManager1 = await prisma.user.create({
    data: {
      name: "Sneha Reddy",
      email: "sneha.reddy@example.com",
      password: passwordHash,
      mobile: "9876543213",
      role: "ReadOnlyManager",
      areaOfResponsibility: "Audit Department",
    },
  });

  const readOnlyManager2 = await prisma.user.create({
    data: {
      name: "Vikram Singh",
      email: "vikram.singh@example.com",
      password: passwordHash,
      mobile: "9876543214",
      role: "ReadOnlyManager",
      areaOfResponsibility: "Compliance Division",
    },
  });

  const readOnlyManager3 = await prisma.user.create({
    data: {
      name: "Anjali Gupta",
      email: "anjali.gupta@example.com",
      password: passwordHash,
      mobile: "9876543215",
      role: "ReadOnlyManager",
      areaOfResponsibility: "Analytics Team",
    },
  });

  const readOnlyManager4 = await prisma.user.create({
    data: {
      name: "Rahul Verma",
      email: "rahul.verma@example.com",
      password: passwordHash,
      mobile: "9876543216",
      role: "ReadOnlyManager",
      areaOfResponsibility: "Quality Assurance",
    },
  });

  // Create Warehouses
  console.log("🏭 Creating warehouses...");
  const warehouse1 = await prisma.warehouse.create({
    data: {
      name: "Ludhiana Central Warehouse",
      location: "Ludhiana, Punjab",
      maxStorageCapacity: "5000 tons",
      maxDryingCapacity: "500 tons/day",
      assignedManagerId: manager1.id,
      remarks: "Main facility with cold storage",
    },
  });

  const warehouse2 = await prisma.warehouse.create({
    data: {
      name: "Jalandhar Storage Unit",
      location: "Jalandhar, Punjab",
      maxStorageCapacity: "3000 tons",
      maxDryingCapacity: "300 tons/day",
      assignedManagerId: manager2.id,
      remarks: "Secondary facility",
    },
  });

  const warehouse3 = await prisma.warehouse.create({
    data: {
      name: "Amritsar Cold Storage",
      location: "Amritsar, Punjab",
      maxStorageCapacity: "4000 tons",
      maxDryingCapacity: "400 tons/day",
      assignedManagerId: manager1.id,
    },
  });

  const warehouse4 = await prisma.warehouse.create({
    data: {
      name: "Patiala Distribution Center",
      location: "Patiala, Punjab",
      maxStorageCapacity: "2500 tons",
      maxDryingCapacity: "250 tons/day",
      assignedManagerId: manager2.id,
      remarks: "Distribution hub",
    },
  });

  // Create 10 Employees and assign to warehouses
  console.log("👷 Creating employees...");
  const employee1 = await prisma.user.create({
    data: {
      name: "Harpreet Singh",
      email: "harpreet.singh@example.com",
      password: passwordHash,
      mobile: "9876543221",
      role: "Employee",
      warehouseid: warehouse1.id,
      areaOfResponsibility: "Loading/Unloading",
    },
  });

  const employee2 = await prisma.user.create({
    data: {
      name: "Simran Kaur",
      email: "simran.kaur@example.com",
      password: passwordHash,
      mobile: "9876543222",
      role: "Employee",
      warehouseid: warehouse1.id,
      areaOfResponsibility: "Quality Check",
    },
  });

  const employee3 = await prisma.user.create({
    data: {
      name: "Gurpreet Singh",
      email: "gurpreet.singh@example.com",
      password: passwordHash,
      mobile: "9876543223",
      role: "Employee",
      warehouseid: warehouse1.id,
      areaOfResponsibility: "Inventory Management",
    },
  });

  const employee4 = await prisma.user.create({
    data: {
      name: "Manpreet Kaur",
      email: "manpreet.kaur@example.com",
      password: passwordHash,
      mobile: "9876543224",
      role: "Employee",
      warehouseid: warehouse2.id,
      areaOfResponsibility: "Dispatch",
    },
  });

  const employee5 = await prisma.user.create({
    data: {
      name: "Jaspreet Singh",
      email: "jaspreet.singh@example.com",
      password: passwordHash,
      mobile: "9876543225",
      role: "Employee",
      warehouseid: warehouse2.id,
      areaOfResponsibility: "Storage Management",
    },
  });

  const employee6 = await prisma.user.create({
    data: {
      name: "Navpreet Kaur",
      email: "navpreet.kaur@example.com",
      password: passwordHash,
      mobile: "9876543226",
      role: "Employee",
      warehouseid: warehouse3.id,
      areaOfResponsibility: "Quality Assurance",
    },
  });

  const employee7 = await prisma.user.create({
    data: {
      name: "Kuldeep Singh",
      email: "kuldeep.singh@example.com",
      password: passwordHash,
      mobile: "9876543227",
      role: "Employee",
      warehouseid: warehouse3.id,
      areaOfResponsibility: "Transportation",
    },
  });

  const employee8 = await prisma.user.create({
    data: {
      name: "Amarjeet Kaur",
      email: "amarjeet.kaur@example.com",
      password: passwordHash,
      mobile: "9876543228",
      role: "Employee",
      warehouseid: warehouse4.id,
      areaOfResponsibility: "Documentation",
    },
  });

  const employee9 = await prisma.user.create({
    data: {
      name: "Sukhdeep Singh",
      email: "sukhdeep.singh@example.com",
      password: passwordHash,
      mobile: "9876543229",
      role: "Employee",
      warehouseid: warehouse4.id,
      areaOfResponsibility: "Warehouse Operations",
    },
  });

  const employee10 = await prisma.user.create({
    data: {
      name: "Rajveer Kaur",
      email: "rajveer.kaur@example.com",
      password: passwordHash,
      mobile: "9876543230",
      role: "Employee",
      warehouseid: warehouse1.id,
      areaOfResponsibility: "Safety & Maintenance",
    },
  });

  // Create Varieties
  console.log("🥔 Creating potato varieties...");
  const variety1 = await prisma.variety.create({
    data: { name: "Kufri Jyoti" },
  });

  const variety2 = await prisma.variety.create({
    data: { name: "Kufri Pukhraj" },
  });

  const variety3 = await prisma.variety.create({
    data: { name: "Kufri Chandramukhi" },
  });

  const variety4 = await prisma.variety.create({
    data: { name: "Kufri Badshah" },
  });

  const variety5 = await prisma.variety.create({
    data: { name: "Kufri Ashoka" },
  });

  const variety6 = await prisma.variety.create({
    data: { name: "Lady Rosetta" },
  });

  const variety7 = await prisma.variety.create({
    data: { name: "Atlantic" },
  });

  // Helper function for random dates
  const getRandomDate = (start, end) => {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  };

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  // Create Lots with varying dates
  console.log("📦 Creating lots...");
  const sizes = [
    "Seed",
    "Soot12",
    "Soot11",
    "Soot10",
    "Soot8",
    "Soot4to6",
    "Soot4to8",
  ];
  const varieties = [
    variety1,
    variety2,
    variety3,
    variety4,
    variety5,
    variety6,
    variety7,
  ];
  const warehouses = [warehouse1, warehouse2, warehouse3, warehouse4];

  const lots = [];
  let lotCounter = 1;

  // Create lots with past storage dates (early 2025)
  for (let i = 0; i < 30; i++) {
    const storageDate = getRandomDate(
      new Date("2025-01-01"),
      new Date("2025-06-01")
    );
    const lot = await prisma.lot.create({
      data: {
        lotNo: `LOT-2025-${String(lotCounter++).padStart(4, "0")}`,
        varietyId: varieties[Math.floor(Math.random() * varieties.length)].id,
        quantity: Math.floor(Math.random() * 5000) + 1000,
        quantityOnHold: Math.floor(Math.random() * 500),
        size: sizes[Math.floor(Math.random() * sizes.length)],
        storageDate: storageDate,
        expiryDate: addDays(storageDate, Math.floor(Math.random() * 120) + 60),
        warehouseId:
          warehouses[Math.floor(Math.random() * warehouses.length)].id,
        remarks:
          Math.random() > 0.7
            ? "Good quality stock"
            : Math.random() > 0.5
            ? "Premium grade"
            : undefined,
      },
    });
    lots.push(lot);
  }

  // Create lots with mid-2025 storage dates
  for (let i = 0; i < 20; i++) {
    const storageDate = getRandomDate(
      new Date("2025-06-01"),
      new Date("2025-09-01")
    );
    const lot = await prisma.lot.create({
      data: {
        lotNo: `LOT-2025-${String(lotCounter++).padStart(4, "0")}`,
        varietyId: varieties[Math.floor(Math.random() * varieties.length)].id,
        quantity: Math.floor(Math.random() * 5000) + 1000,
        quantityOnHold: Math.floor(Math.random() * 800),
        size: sizes[Math.floor(Math.random() * sizes.length)],
        storageDate: storageDate,
        expiryDate: addDays(storageDate, Math.floor(Math.random() * 120) + 60),
        warehouseId:
          warehouses[Math.floor(Math.random() * warehouses.length)].id,
      },
    });
    lots.push(lot);
  }

  // Create lots with late 2025 storage dates
  for (let i = 0; i < 20; i++) {
    const storageDate = getRandomDate(
      new Date("2025-09-01"),
      new Date("2025-12-31")
    );
    const lot = await prisma.lot.create({
      data: {
        lotNo: `LOT-2025-${String(lotCounter++).padStart(4, "0")}`,
        varietyId: varieties[Math.floor(Math.random() * varieties.length)].id,
        quantity: Math.floor(Math.random() * 5000) + 1000,
        quantityOnHold: Math.floor(Math.random() * 300),
        size: sizes[Math.floor(Math.random() * sizes.length)],
        storageDate: storageDate,
        expiryDate: addDays(storageDate, Math.floor(Math.random() * 120) + 60),
        warehouseId:
          warehouses[Math.floor(Math.random() * warehouses.length)].id,
      },
    });
    lots.push(lot);
  }

  // Create lots with 2026 storage dates
  for (let i = 0; i < 15; i++) {
    const storageDate = getRandomDate(
      new Date("2026-01-01"),
      new Date("2026-06-30")
    );
    const lot = await prisma.lot.create({
      data: {
        lotNo: `LOT-2026-${String(i + 1).padStart(4, "0")}`,
        varietyId: varieties[Math.floor(Math.random() * varieties.length)].id,
        quantity: Math.floor(Math.random() * 5000) + 1000,
        quantityOnHold: 0,
        size: sizes[Math.floor(Math.random() * sizes.length)],
        storageDate: storageDate,
        expiryDate: addDays(storageDate, Math.floor(Math.random() * 120) + 60),
        warehouseId:
          warehouses[Math.floor(Math.random() * warehouses.length)].id,
        remarks: "Scheduled intake",
      },
    });
    lots.push(lot);
  }

  // Create Orders
  console.log("📋 Creating orders...");
  const employees = [
    employee1,
    employee2,
    employee3,
    employee4,
    employee5,
    employee6,
    employee7,
    employee8,
    employee9,
    employee10,
  ];
  const managers = [manager1, manager2];
  const creators = [admin, manager1, manager2];
  const destinations = [
    "Delhi Market",
    "Mumbai Distribution",
    "Bangalore Depot",
    "Kolkata Wholesale",
    "Chennai Market",
    "Hyderabad Hub",
    "Pune Distribution",
    "Ahmedabad Market",
    "Jaipur Wholesale",
    "Chandigarh Local",
  ];

  // Past completed orders (early 2025) - completed same day or within 1-2 days
  for (let i = 0; i < 40; i++) {
    const createdAt = getRandomDate(
      new Date("2025-01-01"),
      new Date("2025-06-01")
    );
    // Acknowledged within hours (0-0.5 days)
    const acknowledgedAt = addDays(createdAt, Math.random() * 0.5);
    // Completed same day or next day (0.5-1.5 days after acknowledgment)
    const completedAt = addDays(acknowledgedAt, Math.random() * 1 + 0.5);
    const lot = lots[Math.floor(Math.random() * lots.length)];
    const assignedManager =
      managers[Math.floor(Math.random() * managers.length)];
    const assignedEmployeesList = [
      employees[Math.floor(Math.random() * employees.length)],
    ];
    if (Math.random() > 0.5) {
      assignedEmployeesList.push(
        employees[Math.floor(Math.random() * employees.length)]
      );
    }

    await prisma.order.create({
      data: {
        destination:
          destinations[Math.floor(Math.random() * destinations.length)],
        lotId: lot.id,
        quantity: Math.floor(Math.random() * 500) + 100,
        warehouseId: lot.warehouseId,
        createdById: creators[Math.floor(Math.random() * creators.length)].id,
        assignedManagerId: assignedManager.id,
        createdAt: createdAt,
        updatedAt: completedAt,
        completedAt: completedAt,
        isComplete: true,
        completedById: assignedManager.id,
        isAcknowledged: true,
        acknowledgedById: assignedManager.id,
        acknowledgedAt: acknowledgedAt,
        status: "completed",
        remarks: Math.random() > 0.7 ? "Delivered on time" : undefined,
        assignedEmployees: {
          connect: assignedEmployeesList.map((e) => ({ id: e.id })),
        },
      },
    });
  }

  // More completed orders - mid 2025 (same day/next day completion)
  for (let i = 0; i < 30; i++) {
    const createdAt = getRandomDate(
      new Date("2025-06-01"),
      new Date("2025-09-01")
    );
    const acknowledgedAt = addDays(createdAt, Math.random() * 0.5);
    const completedAt = addDays(acknowledgedAt, Math.random() * 1 + 0.5);
    const lot = lots[Math.floor(Math.random() * lots.length)];
    const assignedManager =
      managers[Math.floor(Math.random() * managers.length)];
    const assignedEmployeesList = [
      employees[Math.floor(Math.random() * employees.length)],
    ];
    if (Math.random() > 0.5) {
      assignedEmployeesList.push(
        employees[Math.floor(Math.random() * employees.length)]
      );
    }

    await prisma.order.create({
      data: {
        destination:
          destinations[Math.floor(Math.random() * destinations.length)],
        lotId: lot.id,
        quantity: Math.floor(Math.random() * 500) + 100,
        warehouseId: lot.warehouseId,
        createdById: creators[Math.floor(Math.random() * creators.length)].id,
        assignedManagerId: assignedManager.id,
        createdAt: createdAt,
        updatedAt: completedAt,
        completedAt: completedAt,
        isComplete: true,
        completedById: assignedManager.id,
        isAcknowledged: true,
        acknowledgedById: assignedManager.id,
        acknowledgedAt: acknowledgedAt,
        status: "completed",
        remarks: Math.random() > 0.7 ? "Delivered on time" : undefined,
        assignedEmployees: {
          connect: assignedEmployeesList.map((e) => ({ id: e.id })),
        },
      },
    });
  }

  // Acknowledged orders (in progress) - recent orders within last 2 days
  for (let i = 0; i < 15; i++) {
    const createdAt = getRandomDate(
      new Date("2025-12-02"),
      new Date("2025-12-04")
    );
    const acknowledgedAt = addDays(createdAt, Math.random() * 0.3);
    const lot = lots[Math.floor(Math.random() * lots.length)];
    const assignedManager =
      managers[Math.floor(Math.random() * managers.length)];
    const assignedEmployeesList = [
      employees[Math.floor(Math.random() * employees.length)],
    ];
    if (Math.random() > 0.5) {
      assignedEmployeesList.push(
        employees[Math.floor(Math.random() * employees.length)]
      );
    }

    await prisma.order.create({
      data: {
        destination:
          destinations[Math.floor(Math.random() * destinations.length)],
        lotId: lot.id,
        quantity: Math.floor(Math.random() * 500) + 100,
        warehouseId: lot.warehouseId,
        createdById: creators[Math.floor(Math.random() * creators.length)].id,
        assignedManagerId: assignedManager.id,
        createdAt: createdAt,
        updatedAt: acknowledgedAt,
        isComplete: false,
        isAcknowledged: true,
        acknowledgedById: assignedManager.id,
        acknowledgedAt: acknowledgedAt,
        status: "acknowledged",
        remarks: "In progress",
        assignedEmployees: {
          connect: assignedEmployeesList.map((e) => ({ id: e.id })),
        },
      },
    });
  }

  // Recently placed orders (not yet acknowledged) - very recent (last few hours)
  for (let i = 0; i < 10; i++) {
    const createdAt = getRandomDate(
      new Date("2025-12-03"),
      new Date("2025-12-04")
    );
    const lot = lots[Math.floor(Math.random() * lots.length)];
    const assignedManager =
      managers[Math.floor(Math.random() * managers.length)];
    const assignedEmployeesList = [
      employees[Math.floor(Math.random() * employees.length)],
    ];

    await prisma.order.create({
      data: {
        destination:
          destinations[Math.floor(Math.random() * destinations.length)],
        lotId: lot.id,
        quantity: Math.floor(Math.random() * 500) + 100,
        warehouseId: lot.warehouseId,
        createdById: creators[Math.floor(Math.random() * creators.length)].id,
        assignedManagerId: assignedManager.id,
        createdAt: createdAt,
        updatedAt: createdAt,
        isComplete: false,
        isAcknowledged: false,
        status: "placed",
        remarks: "Pending acknowledgment",
        assignedEmployees: {
          connect: assignedEmployeesList.map((e) => ({ id: e.id })),
        },
      },
    });
  }

  // Scheduled orders for next few days
  for (let i = 0; i < 20; i++) {
    const createdAt = getRandomDate(
      new Date("2025-12-01"),
      new Date("2025-12-04")
    );
    const lot = lots[Math.floor(Math.random() * lots.length)];
    const assignedManager =
      managers[Math.floor(Math.random() * managers.length)];
    const assignedEmployeesList = [
      employees[Math.floor(Math.random() * employees.length)],
    ];

    const isAcknowledged = Math.random() > 0.5;
    const acknowledgedAt = isAcknowledged
      ? addDays(createdAt, Math.random() * 0.5)
      : null;

    await prisma.order.create({
      data: {
        destination:
          destinations[Math.floor(Math.random() * destinations.length)],
        lotId: lot.id,
        quantity: Math.floor(Math.random() * 500) + 100,
        warehouseId: lot.warehouseId,
        createdById: creators[Math.floor(Math.random() * creators.length)].id,
        assignedManagerId: assignedManager.id,
        createdAt: createdAt,
        updatedAt: acknowledgedAt || createdAt,
        isComplete: false,
        isAcknowledged: isAcknowledged,
        acknowledgedById: isAcknowledged ? assignedManager.id : null,
        acknowledgedAt: acknowledgedAt,
        status: isAcknowledged ? "acknowledged" : "placed",
        remarks: "Scheduled for dispatch",
        assignedEmployees: {
          connect: assignedEmployeesList.map((e) => ({ id: e.id })),
        },
      },
    });
  }

  console.log("✅ Seed completed successfully!");
  console.log(`
  📊 Summary:
  - Users: ${await prisma.user.count()}
    • 1 Administrator
    • 2 Managers
    • 4 Read-Only Managers
    • 10 Employees
  - Warehouses: ${await prisma.warehouse.count()}
  - Varieties: ${await prisma.variety.count()}
  - Lots: ${await prisma.lot.count()}
  - Orders: ${await prisma.order.count()}
  
  🔐 Test Credentials:
  Admin:
    Email: admin@example.com
    Password: password123
  
  Manager:
    Email: rajesh.kumar@example.com
    Password: password123
  
  Read-Only Manager:
    Email: sneha.reddy@example.com
    Password: password123
  
  Employee:
    Email: harpreet.singh@example.com
    Password: password123
  `);
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
