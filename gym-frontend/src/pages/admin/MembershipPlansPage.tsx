import PlansDataTable from "@/features/membershipPlans/components/PlansDataTable"
import PlanFormDialog from "@/features/membershipPlans/components/MembershipPlanFormDialog"
import MembershipPlansHeader from "@/features/membershipPlans/components/MembershipPlansHeader"
import { useMembershipPlans } from "@/features/membershipPlans/hooks/useMembershipPlans"

export default function MembershipPlansPage() {
  const {
    membershipPlans,
    dialogOpen,
    setDialogOpen,
    planToEdit,
    handleNew,
    handleEdit,
    handleDelete,
    handleSave,
  } = useMembershipPlans()

  return (
    <div className="space-y-4">
      <MembershipPlansHeader
        totalPlans={membershipPlans.length}
        onNew={handleNew}
      />

      <div className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
        <PlansDataTable
          plans={membershipPlans}
          onEdit={handleEdit}
          onDelete={handleDelete}
          title="Listado de Planes"
          subtitle="Planes registrados en el sistema"
        />
      </div>

      <PlanFormDialog
        key={`${planToEdit?.id ?? "new"}-${dialogOpen ? "open" : "closed"}`}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        planToEdit={planToEdit}
        onSave={handleSave}
      />
    </div>
  )
}