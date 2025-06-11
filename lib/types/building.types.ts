export type Building = {
  buildingId: string;
  name: string;
  floor: number;
}

export type BuildingCreating = {
  name: string;
  floor: number;
}
export type BuildingUpdating = Partial<BuildingCreating>