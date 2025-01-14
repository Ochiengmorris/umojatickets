"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  phone: z.string().min(10, "Phone number is required"),
  pin: z.string().min(4, "PIN is required").optional(),
  amount: z.number().positive(),
});
const AdminWithdrawForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      pin: "",
      amount: 0,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
  }

  return (
    <div className="mt-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    placeholder="0712345678"
                    className="max-w-md"
                  />
                </FormControl>
                <FormDescription>
                  Enter your M-Pesa phone number.
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input {...field} type="number" className="max-w-md" />
                </FormControl>
                <FormDescription>Enter Amount to withdraw</FormDescription>
              </FormItem>
            )}
          />
          <Button type="submit">Withdraw</Button>
        </form>
      </Form>
    </div>
  );
};

export default AdminWithdrawForm;
