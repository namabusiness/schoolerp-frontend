"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Library, Plus, Search, BookCheck, AlertTriangle } from "lucide-react";

const INITIAL_BOOKS = [
  { id: "b-1", title: "The Feynman Lectures on Physics - Vol 1", author: "Richard P. Feynman", isbn: "978-0465024933", category: "Physics", total: 8, available: 7 },
  { id: "b-2", title: "Calculus: Early Transcendentals", author: "James Stewart", isbn: "978-1285741550", category: "Mathematics", total: 12, available: 11 },
  { id: "b-3", title: "Organic Chemistry 8th Edition", author: "Paula Yurkanis Bruice", isbn: "978-0134042282", category: "Chemistry", total: 6, available: 5 },
  { id: "b-4", title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "978-0060935467", category: "Literature", total: 20, available: 16 },
];

const INITIAL_LOANS = [
  { id: "loan-1", bookTitle: "The Feynman Lectures on Physics - Vol 1", borrower: "Alexander Chen (Grade 10)", issueDate: "2026-09-10", dueDate: "2026-09-24", fine: 0, status: "ISSUED" },
  { id: "loan-2", bookTitle: "Calculus: Early Transcendentals", borrower: "Emma Watson (Grade 10)", issueDate: "2026-09-08", dueDate: "2026-09-22", fine: 0, status: "ISSUED" },
  { id: "loan-3", bookTitle: "To Kill a Mockingbird", borrower: "Liam Smith (Grade 10)", issueDate: "2026-08-20", dueDate: "2026-09-03", fine: 26, status: "OVERDUE" },
];

export default function LibraryPage() {
  const [books, setBooks] = React.useState(INITIAL_BOOKS);
  const [loans, setLoans] = React.useState(INITIAL_LOANS);
  const [search, setSearch] = React.useState("");
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  // New book state
  const [newTitle, setNewTitle] = React.useState("");
  const [newAuthor, setNewAuthor] = React.useState("");
  const [newIsbn, setNewIsbn] = React.useState("");
  const [newCategory, setNewCategory] = React.useState("STEM");
  const [newCopies, setNewCopies] = React.useState(5);

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `b-${Date.now()}`,
      title: newTitle,
      author: newAuthor,
      isbn: newIsbn,
      category: newCategory,
      total: Number(newCopies),
      available: Number(newCopies),
    };
    setBooks([created, ...books]);
    setIsAddOpen(false);
  };

  const handleReturnBook = (loanId: string) => {
    setLoans((prev) =>
      prev.map((l) => (l.id === loanId ? { ...l, status: "RETURNED" } : l))
    );
  };

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Library Circulation Flow</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            FLOW #17: CATALOGUE, ISBN TRACKING, LOANS, OVERDUE FINES & CIRCULATION HISTORY
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-white text-black hover:bg-zinc-200 text-xs">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Catalogue New Book
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-zinc-950 border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-base text-white">Add Book to Catalogue</DialogTitle>
              <DialogDescription className="text-xs text-zinc-400">
                Register ISBN and create copy tracking barcodes.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddBook} className="space-y-3 py-2 text-xs">
              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Book Title</Label>
                <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required className="bg-zinc-900 border-zinc-800 text-white" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-zinc-300">Author</Label>
                  <Input value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} required className="bg-zinc-900 border-zinc-800 text-white" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-zinc-300">ISBN-13</Label>
                  <Input value={newIsbn} onChange={(e) => setNewIsbn(e.target.value)} required className="bg-zinc-900 border-zinc-800 text-white font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-zinc-300">Category</Label>
                  <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="bg-zinc-900 border-zinc-800 text-white" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-zinc-300">Copies Stocked</Label>
                  <Input type="number" value={newCopies} onChange={(e) => setNewCopies(Number(e.target.value))} className="bg-zinc-900 border-zinc-800 text-white font-mono" />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)} className="border-zinc-800">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-white text-black hover:bg-zinc-200">
                  Register Book
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="catalogue" className="w-full">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="catalogue" className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            <Library className="h-3.5 w-3.5 mr-1.5" /> Book Catalogue ({books.length})
          </TabsTrigger>
          <TabsTrigger value="loans" className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            <BookCheck className="h-3.5 w-3.5 mr-1.5" /> Active Loans & Overdue Fines ({loans.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="catalogue" className="space-y-4 pt-4">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-3">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="Search catalogue by title, author, ISBN..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 pl-9 text-xs text-white"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead>Book Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>ISBN</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Available Copies</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBooks.map((b) => (
                    <TableRow key={b.id} className="border-zinc-800/60 hover:bg-zinc-900/40 text-xs">
                      <TableCell className="font-medium text-white">{b.title}</TableCell>
                      <TableCell className="text-zinc-300">{b.author}</TableCell>
                      <TableCell className="font-mono text-zinc-400">{b.isbn}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] border-zinc-700">{b.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-white">
                        {b.available} / {b.total} Copies Available
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loans" className="space-y-4 pt-4">
          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead>Book Title</TableHead>
                    <TableHead>Borrower Member</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Overdue Fine</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loans.map((loan) => (
                    <TableRow key={loan.id} className="border-zinc-800/60 hover:bg-zinc-900/40 text-xs font-mono">
                      <TableCell className="font-sans font-medium text-white">{loan.bookTitle}</TableCell>
                      <TableCell className="font-sans text-zinc-300">{loan.borrower}</TableCell>
                      <TableCell className="text-zinc-400">{loan.issueDate}</TableCell>
                      <TableCell className="text-zinc-300">{loan.dueDate}</TableCell>
                      <TableCell className="text-white">
                        {loan.fine > 0 ? `$${loan.fine}.00` : "$0.00"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={loan.status === "OVERDUE" ? "destructive" : loan.status === "RETURNED" ? "contrast" : "outline"}
                          className="text-[10px]"
                        >
                          {loan.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-sans">
                        {loan.status !== "RETURNED" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReturnBook(loan.id)}
                            className="h-7 text-xs border-zinc-700 hover:bg-zinc-800"
                          >
                            Process Return
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
