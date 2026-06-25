"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContact } from "@/actions/contact.actions";
import { toast } from "sonner";

export function ContactForm() {
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);
		const result = await submitContact(new FormData(e.currentTarget));
		setLoading(false);
		if (!result.success) {
			toast.error(result.error);
			return;
		}
		toast.success(result.message);
		e.target.reset();
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-4"
		>
			<div className="grid gap-4 sm:grid-cols-2">
				<div>
					<Label htmlFor="name">Name</Label>
					<Input
						id="name"
						name="name"
						required
					/>
				</div>
				<div>
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						required
					/>
				</div>
			</div>
			<div className="grid gap-4 sm:grid-cols-2">
				<div>
					<Label htmlFor="company">Company</Label>
					<Input
						id="company"
						name="company"
					/>
				</div>
				<div>
					<Label htmlFor="phone">Phone</Label>
					<Input
						id="phone"
						name="phone"
					/>
				</div>
			</div>
			<div>
				<Label htmlFor="subject">Subject</Label>
				<Input
					id="subject"
					name="subject"
					required
				/>
			</div>
			<div>
				<Label htmlFor="message">Message</Label>
				<Textarea
					id="message"
					name="message"
					rows={5}
					required
				/>
			</div>
			<Button
				type="submit"
				disabled={loading}
			>
				{loading ? "Sending..." : "Send Message"}
			</Button>
		</form>
	);
}
