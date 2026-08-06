import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  Add,
  Delete,
  Edit,
  Search,
  Visibility,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TeamService from "../../../services/TeamService";
import { TeamResponse } from "../../../services/Team";

const TeamList = () => {

  const navigate = useNavigate();

  const [teams, setTeams] = useState<TeamResponse[]>([]);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [search, setSearch] = useState("");

  const [selectedTeam, setSelectedTeam] =
    useState<TeamResponse | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const fetchTeams = async () => {

    try {

      setLoading(true);

      const response = await TeamService.getAllTeams();
      const teamsData = response.data.data;

      setTeams(teamsData);
      setSelectedImage(teamsData[0]?.profileImageUrl);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchTeams();

  }, []);

  const handleDelete = async (teamId: string) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this team member?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      await TeamService.deleteTeam(teamId);

      await fetchTeams();

      alert("Team member deleted successfully.");

    } catch (error: any) {

      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Failed to delete team member."
      );

    }

  };

  const filteredTeams = teams.filter((team) =>

    team.fullName
      .toLowerCase()
      .includes(search.toLowerCase())

    ||

    team.designation
      .toLowerCase()
      .includes(search.toLowerCase())

  );

  if (loading) {

    return (

      <Box
        sx={{
          height: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >

        <CircularProgress />

        <Typography
          variant="h6"
          color="text.secondary"
        >
          Loading Team Members...
        </Typography>

      </Box>

    );

  }

  return (

    <Box sx={{ p: 3 }}>

      <Card elevation={3}>

        <CardContent>

          {/* Header */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              mb: 3,
              gap: 2,
            }}
          >

            <Typography
              variant="h5"
              sx={{ fontWeight: 700 }}
            >
              Team Management
            </Typography>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("add")}
            >
              Add Team Member
            </Button>

          </Box>

          {/* Search */}

          <Box sx={{ mb: 3 }}>

            <TextField
              fullWidth
              placeholder="Search Team Member..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              {...({
                SlotProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                },
              } as any)}
            />

          </Box>

          <TableContainer component={Paper}>

            <Table>

              <TableHead>

                <TableRow>

                  <TableCell>
                    <b>Profile</b>
                  </TableCell>

                  <TableCell>
                    <b>Name</b>
                  </TableCell>

                  <TableCell>
                    <b>Designation</b>
                  </TableCell>

                  <TableCell>
                    <b>Email</b>
                  </TableCell>

                  <TableCell>
                    <b>Phone</b>
                  </TableCell>

                  <TableCell align="center">
                    <b>Display Order</b>
                  </TableCell>

                  <TableCell align="center">
                    <b>Actions</b>
                  </TableCell>

                </TableRow>

              </TableHead>

              <TableBody>

                {filteredTeams
                  .slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                  .map((team) => (

                    <TableRow
                      key={team.teamId}
                      hover
                    >

                      {/* Profile */}

                      <TableCell>

                        <Avatar
                          src={team.profileImageUrl}
                          variant="rounded"
                          sx={{ width: 55, height: 55 }}
                        />

                      </TableCell>

                      {/* Name */}

                      <TableCell>

                        <Typography
                          sx={{ fontWeight: 600 }}
                        >
                          {team.fullName}
                        </Typography>

                      </TableCell>

                      {/* Designation */}

                      <TableCell>

                        {team.designation}

                      </TableCell>

                      {/* Email */}

                      <TableCell>

                        {team.email}

                      </TableCell>

                      {/* Phone */}

                      <TableCell>

                        {team.phoneNumber}

                      </TableCell>

                      {/* Display Order */}

                      <TableCell
                        align="center"
                      >

                        {team.displayOrder}

                      </TableCell>

                      {/* Actions */}

                      <TableCell
                        align="center"
                      >

                        <IconButton
                          color="primary"
                          onClick={() => setSelectedTeam(team)}
                        >
                          <Visibility />
                        </IconButton>

                        <IconButton
                          color="warning"
                          onClick={() =>
                            navigate(
                              `edit/${team.teamId}`
                            )
                          }
                        >
                          <Edit />
                        </IconButton>

                        <IconButton
                          color="error"
                          onClick={() =>
                            handleDelete(
                              team.teamId
                            )
                          }
                        >
                          <Delete />
                        </IconButton>

                      </TableCell>

                    </TableRow>

                  ))}

                {filteredTeams.length === 0 && (

                  <TableRow>

                    <TableCell
                      colSpan={7}
                      align="center"
                      sx={{ py: 6 }}
                    >

                      <Typography
                        color="text.secondary"
                      >
                        No Team Members Found.
                      </Typography>

                    </TableCell>

                  </TableRow>

                )}

              </TableBody>

            </Table>

          </TableContainer>

          <TablePagination
            component="div"
            count={filteredTeams.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(event, newPage) =>
              setPage(newPage)
            }
            onRowsPerPageChange={(event) => {

              setRowsPerPage(
                parseInt(
                  event.target.value,
                  10
                )
              );

              setPage(0);

            }}
          />
          {selectedTeam && (

            <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">

              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative animate-in fade-in zoom-in duration-300">

                {/* Close */}

                <button
                  onClick={() => setSelectedTeam(null)}
                  className="absolute top-5 right-5 text-gray-500 hover:text-red-500 text-2xl"
                >
                  ✕
                </button>

                <div className="p-8">

                  {/* Profile */}

                  <div className="flex justify-center">

                    {selectedTeam.profileImageUrl ? (

                      <img
                        src={selectedImage}
                        className="w-32 h-32 rounded-full object-cover border-4 border-amber-500"
                      />

                    ) : (

                      <div className="w-32 h-32 rounded-full bg-amber-600 text-white flex items-center justify-center text-5xl font-bold">

                        {selectedTeam.fullName.charAt(0)}

                      </div>

                    )}

                  </div>

                  <h2 className="text-2xl font-bold text-center mt-5">

                    {selectedTeam.fullName}

                  </h2>

                  <p className="text-center text-gray-500">

                    {selectedTeam.designation}

                  </p>

                  <div className="mt-8 space-y-4">

                    <div className="flex justify-between border-b pb-2">

                      <span className="font-semibold">
                        Email
                      </span>

                      <span>
                        {selectedTeam.email}
                      </span>

                    </div>

                    <div className="flex justify-between border-b pb-2">

                      <span className="font-semibold">
                        Phone
                      </span>

                      <span>
                        {selectedTeam.phoneNumber}
                      </span>

                    </div>

                    <div className="flex justify-between border-b pb-2">

                      <span className="font-semibold">
                        Display Order
                      </span>

                      <span>
                        {selectedTeam.displayOrder}
                      </span>

                    </div>

                    <div>

                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, mb: 1 }}
                      >
                        Bio
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {selectedTeam.shortBio}
                      </Typography>

                    </div>

                    <div className="pt-4 flex flex-wrap gap-3">

                      {selectedTeam.linkedInUrl && (

                        <a
                          href={selectedTeam.linkedInUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 hover:underline"
                        >
                          LinkedIn
                        </a>

                      )}

                      {selectedTeam.instagramUrl && (

                        <a
                          href={selectedTeam.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:underline"
                        >
                          Instagram
                        </a>

                      )}

                      {selectedTeam.facebookUrl && (

                        <a
                          href={selectedTeam.facebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Facebook
                        </a>

                      )}

                      {selectedTeam.twitterUrl && (

                        <a
                          href={selectedTeam.twitterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-500 hover:underline"
                        >
                          Twitter
                        </a>

                      )}

                    </div>

                  </div>

                </div>

              </div>

            </div>

          )}
        </CardContent>

      </Card>

    </Box>

  );

};

export default TeamList;