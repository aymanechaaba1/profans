import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import db from '@/drizzle';
import { claims } from '@/drizzle/schema';
import { formatId, getUser } from '@/lib/utils';
import TimeAgo from 'react-timeago';

function ClaimsTable({
  userClaims,
}: {
  userClaims: (typeof claims.$inferSelect)[];
}) {
  return (
    <Table>
      <TableCaption>A list of your recent claims.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Claim Id</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userClaims?.map((claim) => (
          <TableRow key={claim.id}>
            <TableCell className="font-medium">
              {formatId(claim.id, 'CL')}
            </TableCell>
            <TableCell>{claim.subject}</TableCell>
            <TableCell>
              <TimeAgo date={claim.createdAt!} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ClaimsTable;
