-- CreateTable
CREATE TABLE "Project" (
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "Address" (
    "address" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "AddressProjectDetails" (
    "addressId" TEXT NOT NULL,
    "assets" JSONB NOT NULL,
    "projectSlug" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "AddressProjectDetails_pkey" PRIMARY KEY ("addressId","projectSlug")
);

-- AddForeignKey
ALTER TABLE "AddressProjectDetails" ADD CONSTRAINT "AddressProjectDetails_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddressProjectDetails" ADD CONSTRAINT "AddressProjectDetails_projectSlug_fkey" FOREIGN KEY ("projectSlug") REFERENCES "Project"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
