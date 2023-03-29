import "bootstrap/dist/css/bootstrap.css";
import Head from "next/head";
import Image from "next/image";
import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { BasicIpfsData } from "../utils";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BasicIpfsData | null>(null);

  const [txt, setTxt] = useState("");
  const [cid, setCid] = useState("");

  const saveNote = async () => {
    const methodName = "[saveNote]";
    if (!loading && txt) {
      setLoading(true);
      try {
        const { data } = await axios.post("/api/ipfs", { text: txt });
        //TODO: need to remove this console
        console.log(data);
        setTxt("");
        setLoading(false);
        alert(`CID : ${data?.data?.cid}`);
      } catch (error) {
        setLoading(false);
        console.log(methodName + "-->", error);
      }
    }
    setLoading(false);
  };

  const retrieveNote = async () => {
    const methodName = "[saveNote]";
    if (!loading && cid) {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/ipfs?cid=${cid}`);
        //TODO: need to remove this console
        console.log(data);
        setResult(data.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(methodName + "-->", error);
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>IPFS Notes</title>
        <meta name="description" content="IPFS Notes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex flex-col gap-3">
          <div className="text-3xl font-bold underline">IPFS Notes</div>
          <div>
            <Form>
              <Form.Group>
                <Form.Label>Write note</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter text"
                  value={txt}
                  onChange={(e) => setTxt(e.target.value)}
                />
              </Form.Group>
              <Button style={styles.button} onClick={saveNote}>
                Save to IPFS
              </Button>
            </Form>
          </div>
          {!!result ? (
            <div className="flex flex-col">
              <span>Content: {result.content}</span>
              <span>CID: {result.cid}</span>
            </div>
          ) : null}
          <div>
            <Form>
              <Form.Control
                style={styles.input}
                type="input"
                placeholder="Enter CID"
                value={cid}
                onChange={(e) => setCid(e.target.value)}
              />
              <Button style={styles.button} onClick={retrieveNote}>
                Retrieve data
              </Button>
            </Form>
          </div>
        </div>
      </main>
    </>
  );
}

//css
const styles = {
  error: {
    color: "red",
  },
  input: {
    width: "400px",
  },
  button: {
    height: "40px",
    width: "185px",
    marginRight: 15,
    marginTop: 15,
    marginBottom: 15,
  },
};
