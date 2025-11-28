const { PrismaClient, UserRoles, PotatoSizes, OrderStatus } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.order.deleteMany();
  await prisma.lot.deleteMany();
  await prisma.variety.deleteMany();
  await prisma.user.deleteMany();
  await prisma.warehouse.deleteMany();

  console.log('Cleared existing data');

  // Create Varieties
  const varieties = await Promise.all([
    prisma.variety.create({ data: { name: 'Russet Burbank' } }),
    prisma.variety.create({ data: { name: 'Yukon Gold' } }),
    prisma.variety.create({ data: { name: 'Red Pontiac' } }),
    prisma.variety.create({ data: { name: 'Kennebec' } }),
    prisma.variety.create({ data: { name: 'Fingerling' } }),
    prisma.variety.create({ data: { name: 'Purple Majesty' } }),
    prisma.variety.create({ data: { name: 'Atlantic' } }),
    prisma.variety.create({ data: { name: 'Shepody' } }),
  ]);

  console.log(`Created ${varieties.length} varieties`);

  // Create Warehouses
  const warehouses = await Promise.all([
    prisma.warehouse.create({
      data: {
        name: 'Central Hub',
        location: 'Punjab, India',
        maxStorageCapacity: '50000 tons',
        maxDryingCapacity: '10000 tons',
        remarks: 'Main distribution center',
      },
    }),
    prisma.warehouse.create({
      data: {
        name: 'North Wing',
        location: 'Ludhiana, Punjab',
        maxStorageCapacity: '30000 tons',
        maxDryingCapacity: '6000 tons',
        remarks: 'Temperature controlled facility',
      },
    }),
    prisma.warehouse.create({
      data: {
        name: 'East Storage',
        location: 'Jalandhar, Punjab',
        maxStorageCapacity: '25000 tons',
        maxDryingCapacity: '5000 tons',
        remarks: 'Recently renovated',
      },
    }),
    prisma.warehouse.create({
      data: {
        name: 'South Facility',
        location: 'Patiala, Punjab',
        maxStorageCapacity: '40000 tons',
        maxDryingCapacity: '8000 tons',
        remarks: 'Largest capacity warehouse',
      },
    }),
    prisma.warehouse.create({
      data: {
        name: 'West Depot',
        location: 'Amritsar, Punjab',
        maxStorageCapacity: '20000 tons',
        maxDryingCapacity: '4000 tons',
        remarks: 'Near border checkpoint',
      },
    }),
  ]);

  console.log(`Created ${warehouses.length} warehouses`);

  // Hash password for users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Users
  const administrators = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@warehouse.com',
        password: hashedPassword,
        mobile: '+91-9876543210',
        role: UserRoles.Administrator,
        remarks: 'System administrator',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Priya Singh',
        email: 'priya.singh@warehouse.com',
        password: hashedPassword,
        mobile: '+91-9876543211',
        role: UserRoles.Administrator,
        remarks: 'IT administrator',
      },
    }),
  ]);

  const managers = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Amit Sharma',
        email: 'amit.sharma@warehouse.com',
        password: hashedPassword,
        mobile: '+91-9876543212',
        role: UserRoles.Manager,
        areaOfResponsibility: 'Operations',
        warehouseid: warehouses[0].id,
        remarks: 'Senior operations manager',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Sunita Verma',
        email: 'sunita.verma@warehouse.com',
        password: hashedPassword,
        mobile: '+91-9876543213',
        role: UserRoles.Manager,
        areaOfResponsibility: 'Quality Control',
        warehouseid: warehouses[1].id,
        remarks: 'Quality assurance specialist',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Vikram Patel',
        email: 'vikram.patel@warehouse.com',
        password: hashedPassword,
        mobile: '+91-9876543214',
        role: UserRoles.Manager,
        areaOfResponsibility: 'Logistics',
        warehouseid: warehouses[2].id,
        remarks: 'Logistics coordinator',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Neha Gupta',
        email: 'neha.gupta@warehouse.com',
        password: hashedPassword,
        mobile: '+91-9876543215',
        role: UserRoles.Manager,
        areaOfResponsibility: 'Storage Management',
        warehouseid: warehouses[3].id,
      },
    }),
  ]);

  const readOnlyManagers = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Arun Mehta',
        email: 'arun.mehta@warehouse.com',
        password: hashedPassword,
        mobile: '+91-9876543216',
        role: UserRoles.ReadOnlyManager,
        areaOfResponsibility: 'Analytics',
        warehouseid: warehouses[0].id,
        remarks: 'Data analyst',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Kavita Desai',
        email: 'kavita.desai@warehouse.com',
        password: hashedPassword,
        mobile: '+91-9876543217',
        role: UserRoles.ReadOnlyManager,
        areaOfResponsibility: 'Reporting',
        warehouseid: warehouses[4].id,
      },
    }),
  ]);

  const employees = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Rohit Singh',
        email: 'rohit.singh@warehouse.com',
        password: hashedPassword,
        mobile: '+91-9876543218',
        role: UserRoles.Employee,
        areaOfResponsibility: 'Loading',
        warehouseid: warehouses[0].id,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Anjali Joshi',
        email: 'anjali.joshi@warehouse.com',
        password: hashedPassword,
        mobile: '+91-9876543219',
        role: UserRoles.Employee,
        areaOfResponsibility: 'Unloading',
        warehouseid: warehouses[0].id,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Suresh Yadav',
        email: 'suresh.yadav@warehouse.com',
        password: hashedPassword,
        mobile: '+91-9876543220',
        role: UserRoles.Employee,
        areaOfResponsibility: 'Sorting',
        warehouseid: warehouses[1].id,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Meena Kumari',
        email: 'meena.kumari@warehouse.com',
        password: hashedPassword,
        mobile: '+91-9876543221',
        role: UserRoles.Employee,
        areaOfResponsibility: 'Packaging',
        warehouseid: warehouses[1].id,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Deepak Chauhan',
        email: 'deepak.chauhan@warehouse.com',
        password: hashedPassword,
        mobile: '+91-9876543222',
        role: UserRoles.Employee,
        areaOfResponsibility: 'Inventory',
        warehouseid: warehouses[2].id,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Pooja Reddy',
        email: 'pooja.reddy@warehouse.com',
        password: hashedPassword,
        mobile: '+91-9876543223',
        role: UserRoles.Employee,
        areaOfResponsibility: 'Quality Check',
        warehouseid: warehouses[2].id,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Manish Tiwari',
        email: 'manish.tiwari@warehouse.com',
        password: hashedPassword,
        mobile: '+91-9876543224',
        role: UserRoles.Employee,
        areaOfResponsibility: 'Dispatch',
        warehouseid: warehouses[3].id,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Divya Nair',
        email: 'divya.nair@warehouse.com',
        password: hashedPassword,
        mobile: '+91-9876543225',
        role: UserRoles.Employee,
        areaOfResponsibility: 'Receiving',
        warehouseid: warehouses[3].id,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Karan Malhotra',
        email: 'karan.malhotra@warehouse.com',
        password: hashedPassword,
        mobile: '+91-9876543226',
        role: UserRoles.Employee,
        areaOfResponsibility: 'Storage',
        warehouseid: warehouses[4].id,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Simran Kaur',
        email: 'simran.kaur@warehouse.com',
        password: hashedPassword,
        mobile: '+91-9876543227',
        role: UserRoles.Employee,
        areaOfResponsibility: 'Documentation',
        warehouseid: warehouses[4].id,
      },
    }),
  ]);

  console.log(`Created ${administrators.length + managers.length + readOnlyManagers.length + employees.length} users`);

  // Create Lots
  const lots = [];
  const sizes = Object.values(PotatoSizes);
  
  for (let i = 0; i < 50; i++) {
    const variety = varieties[Math.floor(Math.random() * varieties.length)];
    const warehouse = warehouses[Math.floor(Math.random() * warehouses.length)];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const quantity = Math.floor(Math.random() * 10000) + 1000;
    const quantityOnHold = Math.floor(Math.random() * (quantity / 2));
    const storageDate = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000);
    const expiryDate = new Date(storageDate.getTime() + (365 * 24 * 60 * 60 * 1000));

    const lot = await prisma.lot.create({
      data: {
        lotNo: `LOT-${String(i + 1).padStart(5, '0')}`,
        varietyId: variety.id,
        quantity,
        quantityOnHold,
        size,
        storageDate,
        expiryDate,
        warehouseId: warehouse.id,
        remarks: Math.random() > 0.7 ? 'Premium quality batch' : undefined,
      },
    });

    lots.push(lot);
  }

  console.log(`Created ${lots.length} lots`);

  // Create Orders
  const orderStatuses = [OrderStatus.placed, OrderStatus.acknowledged, OrderStatus.completed];
  const destinations = [
    'Delhi Market',
    'Mumbai Distribution',
    'Bangalore Hub',
    'Kolkata Center',
    'Chennai Depot',
    'Hyderabad Facility',
    'Pune Storage',
    'Ahmedabad Warehouse',
    'Jaipur Center',
    'Chandigarh Hub',
  ];

  for (let i = 0; i < 100; i++) {
    const lot = lots[Math.floor(Math.random() * lots.length)];
    const warehouse = warehouses.find(w => w.id === lot.warehouseId);
    const creator = [...administrators, ...managers][Math.floor(Math.random() * (administrators.length + managers.length))];
    const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
    const quantity = Math.floor(Math.random() * 500) + 50;
    const destination = destinations[Math.floor(Math.random() * destinations.length)];
    
    const assignedManager = managers.filter(m => m.warehouseid === warehouse.id);
    const assignedEmployeesForOrder = employees.filter(e => e.warehouseid === warehouse.id).slice(0, Math.floor(Math.random() * 3) + 1);
    
    const createdAt = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
    const isAcknowledged = status !== OrderStatus.placed;
    const isComplete = status === OrderStatus.completed;
    const acknowledgedAt = isAcknowledged ? new Date(createdAt.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000) : undefined;
    const completedAt = isComplete && acknowledgedAt ? new Date(acknowledgedAt.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000) : undefined;

    await prisma.order.create({
      data: {
        destination,
        lotId: lot.id,
        quantity,
        warehouseId: warehouse.id,
        createdById: creator.id,
        assignedManager: assignedManager.length > 0 ? {
          connect: assignedManager.map(m => ({ id: m.id }))
        } : undefined,
        assignedEmployees: assignedEmployeesForOrder.length > 0 ? {
          connect: assignedEmployeesForOrder.map(e => ({ id: e.id }))
        } : undefined,
        createdAt,
        updatedAt: acknowledgedAt || completedAt,
        completedAt,
        isComplete,
        completedById: isComplete ? assignedEmployeesForOrder[0]?.id : undefined,
        isAcknowledged,
        acknowledgedById: isAcknowledged && assignedManager[0] ? assignedManager[0].id : undefined,
        acknowledgedAt,
        status,
        remarks: Math.random() > 0.8 ? 'Urgent delivery required' : undefined,
      },
    });
  }

  console.log('Created 100 orders');
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });