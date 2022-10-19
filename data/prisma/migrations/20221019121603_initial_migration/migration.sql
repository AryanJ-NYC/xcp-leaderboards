-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "address" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "AddressAssets" (
    "addressId" TEXT NOT NULL,
    "assets" JSONB NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "AddressAssets_pkey" PRIMARY KEY ("addressId","projectId")
);

-- AddForeignKey
ALTER TABLE "AddressAssets" ADD CONSTRAINT "AddressAssets_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddressAssets" ADD CONSTRAINT "AddressAssets_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
