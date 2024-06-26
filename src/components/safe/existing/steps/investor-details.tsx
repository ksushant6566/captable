"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemStyle,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { SelectSeparator } from "@radix-ui/react-select";
import { RiAddCircleLine } from "@remixicon/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { NumericFormat } from "react-number-format";

export const ADD_STAKEHOLDER = "add-stakeholder";

export const InvestorDetailsFields = [
  "capital",
  "issueDate",
  "boardApprovalDate",
  "stakeholderId",
  "investorName",
  "investorEmail",
  "investorInstitutionName",
];

export const InvestorDetails = () => {
  const router = useRouter();
  const form = useFormContext();
  const { data: session } = useSession();
  const stakeholders = api.stakeholder.getStakeholders.useQuery();
  const stakeholderId = form.watch("stakeholderId");

  const currentStakeholder = useMemo(
    () => stakeholders.data?.find((sh) => sh.id === stakeholderId),
    [stakeholderId, stakeholders],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explain>
  useEffect(() => {
    form.setValue("investorName", currentStakeholder?.name);
    form.setValue("investorEmail", currentStakeholder?.email);
    form.setValue(
      "investorInstitutionName",
      currentStakeholder?.institutionName ?? "No institution",
    );
  }, [stakeholderId]);

  return (
    <div className="grid-cols-2 space-y-4">
      <FormField
        control={form.control}
        name="capital"
        render={({ field }) => {
          const { onChange, ...rest } = field;
          return (
            <FormItem>
              <FormLabel>Valuation cap</FormLabel>
              <FormControl>
                <NumericFormat
                  thousandSeparator
                  allowedDecimalSeparators={["%"]}
                  decimalScale={2}
                  prefix={"$  "}
                  {...rest}
                  customInput={Input}
                  onValueChange={(values) => {
                    const { floatValue } = values;
                    onChange(floatValue);
                  }}
                />
              </FormControl>
              <FormMessage className="text-xs font-light" />
            </FormItem>
          );
        }}
      />

      <FormField
        control={form.control}
        name="issueDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Issue date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage className="text-xs font-light" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="boardApprovalDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Board approval date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage className="text-xs font-light" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="stakeholderId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Stakeholder</FormLabel>
            <Select
              value={field.value}
              onValueChange={(val) => {
                if (val === ADD_STAKEHOLDER) {
                  router.push(`/${session?.user.companyPublicId}/stakeholders`);
                } else {
                  return form.setValue("stakeholderId", val);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select stakeholder" />
              </SelectTrigger>
              <SelectContent>
                {stakeholders?.data?.map((sh) => (
                  <SelectItem key={sh.id} value={sh.id}>
                    {sh.institutionName
                      ? `${sh.institutionName} - ${sh.name}`
                      : `${sh.name}`}
                  </SelectItem>
                ))}
                <SelectSeparator />
                <SelectPrimitive.Item
                  value={ADD_STAKEHOLDER}
                  className={SelectItemStyle}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <RiAddCircleLine className="h-4 w-4" aria-hidden />
                  </span>

                  <SelectPrimitive.ItemText>
                    Add Stakeholder
                  </SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              </SelectContent>
            </Select>
            <FormMessage className="text-xs font-light" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="investorName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Investor name</FormLabel>
            <FormControl>
              <Input type="text" disabled {...field} />
            </FormControl>
            <FormMessage className="text-xs font-light" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="investorEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Investor email</FormLabel>
            <FormControl>
              <Input type="text" disabled {...field} />
            </FormControl>
            <FormMessage className="text-xs font-light" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="investorInstitutionName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Investor institution name</FormLabel>
            <FormControl>
              <Input type="text" disabled {...field} />
            </FormControl>
            <FormMessage className="text-xs font-light" />
          </FormItem>
        )}
      />
    </div>
  );
};
