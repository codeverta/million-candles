import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
  Button,
  ButtonBase,
  FormHelperText,
  List,
  ListItem,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Switch,
  Typography,
} from "@mui/material";
import AdminLayout from "components/layout/AdminLayout";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "utils/api";

function CreateUser() {
  const router = useRouter();
  const [showPasswordInput, setShowPasswordInput] = useState(
    router.query.id ? false : true
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [state, setState] = useState<any>({
    users: {},
    user: {
      id: "",
      attributes: {
        email: "",
        name: "",
        password: "",
        password_confirmation: "",
      },
    },
  });

  useEffect(() => {
    // fetch user
    const id = router.query.id;
    api.get(`users/${id}`).then((res: any) => {
      setState({
        ...state,
        users: res.data,
        user: {
          ...res.data.data,
          attributes: {
            ...res.data.data.attributes,
            password: "",
            password_confirmation: "",
          },
        },
      });
    });
    return () => {};
  }, []);

  const handleGeneratePass = () => {
    var randomstring = Math.random().toString(36).slice(-10);
    setState({
      ...state,
      user: {
        id: "",
        attributes: {
          ...state.user.attributes,
          password: randomstring,
          password_confirmation: randomstring,
        },
      },
    });
  };

  const changeUser = (
    key: "email" | "name" | "password" | "password_confirmation",
    value: string
  ) => {
    const newState = {
      ...state,
      user: {
        ...state.user,
        attributes: {
          ...state.user.attributes,
        } as any,
      },
    };
    newState.user.attributes[key] = value;
    setState(newState);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let payload: any = {
      data: {
        type: "users",
        attributes: state.user.attributes,
      },
    };
    if (router.query.id) {
      payload = {
        data: {
          type: "users",
          id: router.query.id,
          attributes: {
            password: state.user.attributes.password,
            password_confirmation: state.user.attributes.password_confirmation,
          },
        },
      };
      api.patch("users/" + router.query.id, payload).then((res) => {
        res && toast.success("Data pengguna berhasil diubah");
        res && router.push("/admin/users");
      });
    } else {
      api
        .post("users", payload)
        .then((res: any) => {
          if (res) {
            toast.success("Pengguna berhasil dibuat");
            router.push("/admin/users");
          }
        })
        .catch((err) => {
          toast.error(JSON.stringify(err));
        });
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <List>
        <ListItem>
          <TextField
            className="w-full"
            label="Email"
            value={state.user.attributes.email}
            onChange={(e) => changeUser("email", e.target.value)}
            placeholder="Masukkan Email"
            helperText="Wajib diisi"
          />
        </ListItem>
        <ListItem>
          <TextField
            className="w-full"
            value={state.user.attributes.name}
            label="Nama"
            placeholder="Masukkan Nama"
            helperText="Wajib diisi"
            onChange={(e) => changeUser("name", e.target.value)}
          />
        </ListItem>
        {router.query.id && (
          <ListItem className="w-full flex justify-between">
            <Typography className="text-blue-400">Ganti Password?</Typography>
            <Switch
              onClick={() => setShowPasswordInput((state) => !state)}
              checked={showPasswordInput}
            />
          </ListItem>
        )}
        {showPasswordInput && (
          <ListItem className="flex flex-col">
            <FormHelperText
              onClick={handleGeneratePass}
              className="text-blue-400 self-end cursor-pointer"
              id="generate-pass"
            >
              Isi Otomatis
            </FormHelperText>
            <FormControl
              className="w-full !border-none !ring-0"
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan Password"
                value={state.user.attributes.password}
                onChange={(e) => changeUser("password", e.target.value)}
                autoComplete={router.query.id ? "on" : "off"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((show) => !show)}
                      onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) =>
                        e.preventDefault()
                      }
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
          </ListItem>
        )}
        {showPasswordInput && router.query.id && (
          <ListItem>
            <FormControl
              className="w-full !border-none !ring-0"
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="password-confirmation"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Masukkan Konfirmasi Password"
                value={state.user.attributes.password_confirmation}
                onChange={(e) =>
                  changeUser("password_confirmation", e.target.value)
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowConfirmPassword((show) => !show)}
                      onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) =>
                        e.preventDefault()
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
          </ListItem>
        )}

        <ListItem>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className="w-full bg-blue-500"
            title="Tambah Pengguna"
          >
            {router.query.id ? "Edit Pengguna" : "Tambah Pengguna"}
          </Button>
        </ListItem>
      </List>
    </form>
  );
}

CreateUser.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default CreateUser;
