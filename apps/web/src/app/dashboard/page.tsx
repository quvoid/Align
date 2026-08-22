"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { INITIAL_APPLICATIONS, ApplicationItem } from "@/lib/mock-data";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Sparkles,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Building2,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export default function DashboardPage() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [applications, setApplications] = useState<ApplicationItem[]>(INITIAL_APPLICATIONS);
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);

  const approvedCount = applications.filter((a) => a.status === "APPROVED").length;
  const pendingCount = applications.filter(
    (a) => a.status === "PENDING" || a.status === "UNDER_REVIEW" || a.status === "SHORTLISTED"
  ).length;

  const handleWithdraw = (appId: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== appId));
    setSelectedApp(null);
    toast({
      title: "Application Withdrawn",
      description: "You have withdrawn your proposal from this brand campaign.",
      type: "info",
    });
  };

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Top Banner */}
      <div className="bg-primary text-white py-12 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Creator Command Center</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                Welcome back, {session?.user?.name || "Rohan Joshi"}
              </h1>
              <p className="text-white/70 text-sm mt-1">
                Track active campaign pitches, brand agreements, and live performance metrics.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/dashboard/profile">
                <Button variant="outline" className="text-xs font-bold border-white/20 text-white hover:bg-white/10">
                  Edit Media Kit
                </Button>
              </Link>
              <Link href="/brands">
                <Button variant="accent" className="text-xs font-bold shadow-lg shadow-accent/25">
                  Browse Brand Briefs &rarr;
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Card className="rounded-3xl border-border shadow-xs">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
                <span className="font-bold uppercase tracking-wider text-[10px]">Total Submissions</span>
                <FileText className="w-4 h-4 text-accent" />
              </div>
              <div className="text-3xl font-black text-primary">{applications.length}</div>
              <p className="text-[11px] text-text-secondary mt-1">Active campaign pitches</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border shadow-xs">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
                <span className="font-bold uppercase tracking-wider text-[10px]">Shortlisted / Approved</span>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-3xl font-black text-green-600">{approvedCount + 1}</div>
              <p className="text-[11px] text-text-secondary mt-1">Ready for contract phase</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border shadow-xs">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
                <span className="font-bold uppercase tracking-wider text-[10px]">Under Review</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-black text-amber-600">{pendingCount}</div>
              <p className="text-[11px] text-text-secondary mt-1">Agency evaluating metrics</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border shadow-xs">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
                <span className="font-bold uppercase tracking-wider text-[10px]">Creator Rating</span>
                <Award className="w-4 h-4 text-primary" />
              </div>
              <div className="text-3xl font-black text-primary">
                4.9 <span className="text-xs text-text-secondary font-semibold">/ 5.0</span>
              </div>
              <p className="text-[11px] text-text-secondary mt-1">100% on-time delivery</p>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-primary">My Brand Applications &amp; Deals</h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Real-time review status of your campaign pitches managed by Schbang.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 text-text-secondary text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-bold">Brand Campaign</th>
                  <th className="px-6 py-4 font-bold">Deliverables</th>
                  <th className="px-6 py-4 font-bold">Expected Fee</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Applied On</th>
                  <th className="px-6 py-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-primary text-sm">{app.brandName}</div>
                      <span className="text-[11px] text-text-secondary">Schbang Campaign Brief</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {app.deliverables.map((d, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-semibold text-text-secondary"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">
                      ₹{app.expectedRate ? app.expectedRate.toLocaleString() : "TBD"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          app.status === "APPROVED"
                            ? "approved"
                            : app.status === "SHORTLISTED"
                            ? "shortlisted"
                            : app.status === "UNDER_REVIEW"
                            ? "under_review"
                            : "pending"
                        }
                      >
                        {app.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-text-secondary font-medium">
                      {app.date}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedApp(app)}
                        className="text-xs font-bold"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Inspect Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {applications.length === 0 && (
            <div className="p-12 text-center">
              <Layers className="w-12 h-12 text-text-secondary opacity-40 mx-auto mb-3" />
              <h3 className="text-base font-bold text-primary mb-1">No Active Applications</h3>
              <p className="text-xs text-text-secondary mb-4">
                You haven&apos;t pitched to any brand briefs yet.
              </p>
              <Link href="/brands">
                <Button variant="accent" size="sm">
                  Browse Open Briefs
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* APPLICATION DETAILS MODAL                                */}
      {/* ======================================================== */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Application Details: ${selectedApp.brandName}`}
          description={`Submitted on ${selectedApp.date}`}
          size="lg"
        >
          <div className="space-y-6 mt-4">
            {/* Status Strip */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-border flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary block">
                  Current Status
                </span>
                <Badge
                  variant={
                    selectedApp.status === "APPROVED"
                      ? "approved"
                      : selectedApp.status === "SHORTLISTED"
                      ? "shortlisted"
                      : "pending"
                  }
                  className="mt-1 text-xs"
                >
                  {selectedApp.status.replace("_", " ")}
                </Badge>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary block">
                  Proposed Fee
                </span>
                <span className="text-base font-black text-primary">
                  ₹{selectedApp.expectedRate.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Proposal Pitch */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
                Your Creative Proposal
              </h4>
              <p className="p-4 rounded-2xl bg-gray-50 border border-border text-xs text-primary leading-relaxed">
                {selectedApp.proposal}
              </p>
            </div>

            {/* Deliverables */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
                Deliverables Included
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedApp.deliverables.map((d, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-gray-100 border border-border text-xs font-semibold text-primary"
                  >
                    ✓ {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Agency Notes if any */}
            {selectedApp.adminNotes && (
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/70 text-xs">
                <span className="font-bold text-blue-950 block mb-1">
                  💬 Schbang Campaign Lead Notes:
                </span>
                <p className="text-blue-900">{selectedApp.adminNotes}</p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                className="text-error hover:bg-red-50 text-xs"
                onClick={() => handleWithdraw(selectedApp.id)}
              >
                Withdraw Proposal
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedApp(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
