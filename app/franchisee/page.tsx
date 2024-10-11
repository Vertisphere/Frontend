import { db } from '@/lib/db';
import Link from 'next/link';
import {Simplify} from "kysely";
import {AllSelection} from "kysely/dist/cjs/parser/select-parser";
import {ExtractTableAlias} from "kysely/dist/cjs/parser/table-parser";
import {DB} from "kysely-codegen";
import {Franchisee} from "@/lib/kysely-types";

export default async function FranchiseList() {
    const franchisee: Franchisee = await db
        .selectFrom('franchisee')
        .selectAll()
        .execute();

    return (
        <div className="flex flex-col px-24">
            <h1 className="text-3xl font-bold mb-4">Franchise List</h1>
            <div>
                {franchisee.map(franchisee => (
                    <div key={franchisee.franchiseeId} className="mb-2">
                        <Link href={`/franchisee/${franchisee.franchiseeId}`}>
                            <div className="text-lg text-blue-600 hover:underline">
                                {franchisee.franchiseeName}
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
