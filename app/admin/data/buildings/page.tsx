"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Building, Edit, Plus, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuthStore from "@/lib/stores/auth-store";
import { useBuildingStore } from "@/lib/stores/building.store";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete";
import { BuildingCreating } from "@/lib/types/building.types";

export default function BuildingsPage() {
  const {
    buildings,
    fetchBuildings,
    addBuilding,
    updateBuilding,
    deleteBuilding,
  } = useBuildingStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);
  const [formData, setFormData] = useState<BuildingCreating>({
    name: "",
    floor: 1,
  });


  useEffect(() => {
    fetchBuildings();
  }, [fetchBuildings]);

  const [filteredBuildings, setFilteredBuildings] = useState(buildings);
  useEffect(() => {
    const newFiltered = buildings.filter((building) =>
      building.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBuildings(newFiltered);
  }, [searchQuery, buildings]);

  const handleAddBuilding = () => {
    addBuilding(formData);
    setFormData({
      name: "",
      floor: 1,
    });
    setIsAddDialogOpen(false);
  };

  const handleEditBuilding = () => {
    if (selectedBuilding) {
      updateBuilding(selectedBuilding, formData);
      setIsEditDialogOpen(false);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedBuilding) {
      deleteBuilding(selectedBuilding);
    }
  };

  const openEditDialog = (id: string) => {
    const building = buildings.find((b) => b.buildingId === id);
    if (building) {
      setSelectedBuilding(id);
      setFormData({
        name: building.name,
        floor: building.floor,
      });
      setIsEditDialogOpen(true);
    }
  };

  const openConfirmDeleteDialog = (id: string) => {
    setSelectedBuilding(id);
    setIsConfirmDeleteDialogOpen(true);
  };

  const resetFormData = () => {
    setFormData({
      name: "",
      floor: 1,
    });
    setSelectedBuilding(null);
  };

  return (
    <DashboardLayout title="Buildings">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Buildings</h1>
            <p className="text-muted-foreground text-sm">
              Manage building information and accessibility
            </p>
          </div>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Building
          </Button>
        </div>

        {/* Search Section */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search buildings..."
            className="w-full pl-10 py-2 rounded-md border-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Table Section */}
        <div className="rounded-xl border bg-white shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>BUILDING</TableHead>
                <TableHead>FLOOR</TableHead>
                <TableHead className="text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBuildings.map((building) => (
                <TableRow
                  key={building.buildingId}
                  className="hover:bg-muted/40"
                >
                  <TableCell className="flex items-center gap-3 font-medium">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-blue-100 text-blue-600">
                      <Building color="currentColor" className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="font-semibold leading-tight">
                        {building.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ID: {building.buildingId}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>Floor {building.floor}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="edit"
                        size="icon"
                        className="hover:bg-indigo-100"
                        onClick={() => openEditDialog(building.buildingId)}
                        aria-label="Edit"
                      >
                        <Edit color="currentColor" className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="delete"
                        size="icon"
                        className="hover:bg-red-100"
                        onClick={() =>
                          openConfirmDeleteDialog(building.buildingId)
                        }
                        aria-label="Delete"
                      >
                        <Trash2
                          color="currentColor"
                          strokeWidth={2}
                          className="w-5 h-5"
                        />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add/Edit Building Dialog */}
      <Dialog
        open={isAddDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
            resetFormData();
          }
        }}
      >
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>
              {isAddDialogOpen ? "Add New Building" : "Edit Building"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isAddDialogOpen) handleAddBuilding();
              if (isEditDialogOpen) handleEditBuilding();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 mt-5">
              <div className="space-y-2 flex flex-col gap-3 col-span-2">
                <Label htmlFor="name">Building Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Main Building"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2 flex flex-col gap-3">
                <Label htmlFor="floors">Number of Floors</Label>
                <Input
                  id="floors"
                  type="number"
                  placeholder="e.g., 5"
                  value={formData.floor}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      floor: Number.parseInt(e.target.value) || 1,
                    })
                  }
                  min={1}
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setIsEditDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isAddDialogOpen ? "Create Building" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={isConfirmDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        onOpenChange={setIsConfirmDeleteDialogOpen}
      />
    </DashboardLayout>
  );
}
