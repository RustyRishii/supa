import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { supabase } from "../lib/utlities/supabase";
import { useState } from "react";
import universalStyles from "./universalStyles";
import { Pressable, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Colors } from "../lib/utlities/colors";

GoogleSignin.configure({
  webClientId:
    "633436539850-4e3jmq0flpesfcnulan9gpri5lvptp46.apps.googleusercontent.com", // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
  scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
  // offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  // hostedDomain: "", // specifies a hosted domain restriction
  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  // accountName: "", // [Android] specifies an account name on the device that should be used
});

export default function () {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState<string | undefined>(undefined);

  function setState({
    userInfo,
    error,
  }: {
    userInfo: any;
    error: string | undefined;
  }) {
    setUserInfo(userInfo);
    setError(error);
  }

  function isErrorWithCode(error: unknown): error is { code: string } {
    return typeof error === "object" && error !== null && "code" in error;
  }

  function signUp(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <Pressable
        onPress={async () => {
          try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            setState({ userInfo, error: undefined });
            if (userInfo.idToken) {
              const { data, error } = await supabase.auth.signInWithIdToken({
                provider: "google",
                token: userInfo.idToken,
              });
              console.log(error, data);
            } else {
              throw new Error("No ID token present");
            }
          } catch (error: any) {
            if (isErrorWithCode(error)) {
              switch (error.code) {
                case statusCodes.SIGN_IN_CANCELLED:
                  console.log("Sign in cancelled");
                  break;
                case statusCodes.IN_PROGRESS:
                  console.log("Sign in in progress");
                  break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                  console.log("Play services not available");
                  break;
                default:
                  console.log("Some other error occurred", error);
              }
            } else {
              console.log("An unknown error occurred", error);
            }
          }
        }}
        style={{
          flexDirection: "row",
          backgroundColor: Colors.buttonColor,
          height: 50,
          marginVertical: 5,
          borderWidth: 1,
          borderRadius: 5,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          
        }}
      >
        <Icon
          style={{ marginHorizontal: 10 }}
          name="logo-google"
          size={25}
          color={"skyblue"}
        />
        <Text style={universalStyles.authButtonText}>Sign in with Google </Text>
      </Pressable>
    </>
  );
}
//Google sign in button.
{
  /* <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={async () => {
          try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            setState({ userInfo, error: undefined });
            if (userInfo.idToken) {
              const { data, error } = await supabase.auth.signInWithIdToken({
                provider: "google",
                token: userInfo.idToken,
              });
              console.log(error, data);
            } else {
              throw new Error("No ID token present");
            }
          } catch (error: any) {
            if (isErrorWithCode(error)) {
              switch (error.code) {
                case statusCodes.SIGN_IN_CANCELLED:
                  console.log("Sign in cancelled");
                  break;
                case statusCodes.IN_PROGRESS:
                  console.log("Sign in in progress");
                  break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                  console.log("Play services not available");
                  break;
                default:
                  console.log("Some other error occurred", error);
              }
            } else {
              console.log("An unknown error occurred", error);
            }
          }
        }}
      /> */
}
