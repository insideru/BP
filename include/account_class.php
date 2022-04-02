<?php

class Account {
    private $id;
    private $group;
	private $name;
	private $email;
    public $authenticated;
    private $token;

    public function __construct() {
        $this->id = NULL;
        $this->group = 1;
		$this->name = NULL;
		$this->email = NULL;
        $this->authenticated = FALSE;
        $this->token = NULL;
    }

    public function __destruct() {
		
	}

public function addAccount(string $name, string $email, string $passwd): int {
	/* Global $pdo object */
    global $pdo;
    global $schema;
	
	/* Trim the strings to remove extra spaces */
	$name = trim($name);
	$email = trim($email);
	$passwd = trim($passwd);
	
	/* Check if the user name is valid. If not, throw an exception */
	if (!$this->isNameValid($name))
	{
		throw new Exception('Invalid user name');
	}
	
	/* Check if the password is valid. If not, throw an exception */
	if (!$this->isPasswdValid($passwd))
	{
		throw new Exception('Invalid password');
	}
	
	/* Check if an account having the same name already exists. If it does, throw an exception */
	if (!is_null($this->getIdFromEmail($email)))
	{
		throw new Exception('Email deja folosit');
	}
	
	/* Finally, add the new account */
	
	/* Insert query template */
	$query = 'INSERT INTO '.$schema.'.accounts (account_email, account_name, account_passwd) VALUES (:email, :name, :passwd)';
	
	/* Password hash */
	$hash = password_hash($passwd, PASSWORD_DEFAULT);
	
	/* Values array for PDO */
	$values = array(':email' => $email, ':name' => $name, ':passwd' => $hash);
	
	/* Execute the query */
	try
	{
		$res = $pdo->prepare($query);
		$res->execute($values);
	}
	catch (PDOException $e)
	{
	   /* If there is a PDO exception, throw a standard exception */
	   throw new Exception($e->getMessage());
	}
	
	/* Return the new ID */
    return $pdo->lastInsertId();
}

/* A sanitization check for the account username */
public function isNameValid(string $name): bool {
	/* Initialize the return variable */
	$valid = TRUE;
	
	/* Example check: the length must be between 8 and 16 chars */
	$len = mb_strlen($name);
	
	if (($len < 4) || ($len > 40))
	{
		$valid = FALSE;
	}
	
	/* You can add more checks here */
	
	return $valid;
}

/* A sanitization check for the account password */
public function isPasswdValid(string $passwd): bool
{
	/* Initialize the return variable */
	$valid = TRUE;
	
	/* Example check: the length must be between 8 and 16 chars */
	$len = mb_strlen($passwd);
	
	if (($len < 8) || ($len > 16))
	{
		$valid = FALSE;
	}
	
	/* You can add more checks here */
	
	return $valid;
}

/* Returns the account id having $name as name, or NULL if it's not found */
public function getIdFromEmail(string $email): ?int
{
	/* Global $pdo object */
    global $pdo;
    global $schema;
	
	/* Since this method is public, we check $name again here */
	if (!$this->isNameValid($email))
	{
		throw new Exception('Invalid user name');
	}
	
	/* Initialize the return value. If no account is found, return NULL */
	$id = NULL;
	
	/* Search the ID on the database */
	$query = 'SELECT account_id FROM '.$schema.'.accounts WHERE (account_email = :email)';
	$values = array(':email' => $email);
	
	try
	{
		$res = $pdo->prepare($query);
		$res->execute($values);
	}
	catch (PDOException $e)
	{
	   /* If there is a PDO exception, throw a standard exception */
	   throw new Exception($e->getMessage());
	}
	
	$row = $res->fetch(PDO::FETCH_ASSOC);
	
	/* There is a result: get it's ID */
	if (is_array($row))
	{
		$id = intval($row['account_id'], 10);
	}
	
	return $id;
}

public function editAccount(int $id, string $email, string $name, string $passwd, bool $enabled)
{
	/* Global $pdo object */
    global $pdo;
    global $schema;
	
	/* Trim the strings to remove extra spaces */
	$email = trim($email);
	$name = trim($name);
	$passwd = trim($passwd);
	
	/* Check if the ID is valid */
	if (!$this->isIdValid($id))
	{
		throw new Exception('Invalid account ID');
	}
	
	/* Check if the user name is valid. */
	if (!$this->isNameValid($name))
	{
		throw new Exception('Invalid user name');
	}
	
	/* Check if the password is valid. */
	if (!$this->isPasswdValid($passwd))
	{
		throw new Exception('Invalid password');
	}
	
	/* Check if an account having the same name already exists (except for this one). */
	$idFromName = $this->getIdFromEmail($name);
	
	if (!is_null($idFromName) && ($idFromName != $id))
	{
		throw new Exception('User name already used');
	}
	
	/* Finally, edit the account */
	
	/* Edit query template */
	$query = 'UPDATE '.$schema.'.accounts SET account_name = :name, account_passwd = :passwd, account_enabled = :enabled WHERE account_id = :id';
	
	/* Password hash */
	$hash = password_hash($passwd, PASSWORD_DEFAULT);
	
	/* Int value for the $enabled variable (0 = false, 1 = true) */
	$intEnabled = $enabled ? 1 : 0;
	
	/* Values array for PDO */
	$values = array(':name' => $name, ':passwd' => $hash, ':enabled' => $intEnabled, ':id' => $id);
	
	/* Execute the query */
	try
	{
		$res = $pdo->prepare($query);
		$res->execute($values);
	}
	catch (PDOException $e)
	{
	   /* If there is a PDO exception, throw a standard exception */
	   throw new Exception($e->getMessage());
	}
}

public function isIdValid(int $id): bool
{
	/* Initialize the return variable */
	$valid = TRUE;
	
	/* Example check: the ID must be between 1 and 1000000 */
	
	/*if (($id < 1) || ($id > 1000000))
	{
		$valid = FALSE;
	}*/
	
	/* You can add more checks here */
	
	return $valid;
}

public function deleteAccount(int $id)
{
	/* Global $pdo object */
    global $pdo;
    global $schema;
	
	/* Check if the ID is valid */
	if (!$this->isIdValid($id))
	{
		throw new Exception('Invalid account ID');
	}
	
	/* Query template */
	$query = 'DELETE FROM '.$schema.'.accounts WHERE account_id = :id';
	
	/* Values array for PDO */
	$values = array(':id' => $id);
	
	/* Execute the query */
	try
	{
		$res = $pdo->prepare($query);
		$res->execute($values);
	}
	catch (PDOException $e)
	{
	   /* If there is a PDO exception, throw a standard exception */
	   throw new Exception('Database query error');
	}

	/* Delete the Sessions related to the account */
	$query = 'DELETE FROM '.$schema.'.sessions WHERE (account_id = :id)';

	/* Values array for PDO */
	$values = array(':id' => $id);

	/* Execute the query */
	try
	{
		$res = $pdo->prepare($query);
		$res->execute($values);
	}
	catch (PDOException $e)
	{
	   /* If there is a PDO exception, throw a standard exception */
	   throw new Exception($e->getMessage());
	}
}

public function login(string $email, string $passwd, int $remember): bool
{
	/* Global $pdo object */
    global $pdo;
    global $schema;	
	
	/* Trim the strings to remove extra spaces */
	$email = trim($email);
	$passwd = trim($passwd);
	
	/* Check if the user name is valid. If not, return FALSE meaning the authentication failed */
	if (!$this->isNameValid($email))
	{
		return FALSE;
	}
	
	/* Check if the password is valid. If not, return FALSE meaning the authentication failed */
	if (!$this->isPasswdValid($passwd))
	{
		return FALSE;
	}
	
	/* Look for the account in the db. Note: the account must be enabled (account_enabled = 1) */
	$query = 'SELECT * FROM '.$schema.'.accounts WHERE (account_email = :email) AND (account_enabled = 1)';
	
	/* Values array for PDO */
	$values = array(':email' => $email);
	
	/* Execute the query */
	try
	{
		$res = $pdo->prepare($query);
		$res->execute($values);
	}
	catch (PDOException $e)
	{
	   /* If there is a PDO exception, throw a standard exception */
	   throw new Exception($e->getMessage());
	}
	
	$row = $res->fetch(PDO::FETCH_ASSOC);
	
	/* If there is a result, we must check if the password matches using password_verify() */
	if (is_array($row))
	{
		if (password_verify($passwd, $row['account_passwd']))
		{
			/* Authentication succeeded. Set the class properties (id and name) */
			$this->id = intval($row['account_id']);
			$this->group = intval($row['account_group']);
			$this->name = $row['account_name'];
			$this->email = $email;
			$this->authenticated = TRUE;
			/* Register the current Sessions on the database */
			$this->registerLoginSession();

			/* Daca e setat remember */
			if ($remember==1) {

				$current_time = time();
				$current_date = date("Y-m-d H:i:s", $current_time);

				// Set Cookie expiration for 1 month
				$cookie_expiration_time = $current_time + (30 * 24 * 60 * 60);  // for 1 month
	            
	            $random_token = $this->getToken(16);
	            setcookie("wrkTracker", $random_token, $cookie_expiration_time);
	            
	            $random_token_hash = password_hash($random_token, PASSWORD_DEFAULT);

	            //echo $random_token . " || " . $random_token_hash;
	            
	            $expiry_date = date("Y-m-d H:i:s", $cookie_expiration_time);
	            
	            // Insert new token
				$query = 'UPDATE '.$schema.'.sessions SET session_token = :token WHERE (account_id = :id) AND (session_id = :sid)';
				$values = array(':token' => $random_token_hash, ':id' => $this->id, ':sid' => session_id());
				
				/* Execute the query */
				try
				{
					$res = $pdo->prepare($query);
					$res->execute($values);
				}
				catch (PDOException $e)
				{
				   /* If there is a PDO exception, throw a standard exception */
				   throw new Exception($e->getMessage());
				}
			}
					
			/* Finally, Return TRUE */
			return TRUE;
		}
	}
	
	/* If we are here, it means the authentication failed: return FALSE */
	return FALSE;
}

private function registerLoginSession()
{
	/* Global $pdo object */
	global $pdo;
    global $schema;
    
	/* Check that a Session has been started */
	if (session_status() == PHP_SESSION_ACTIVE)
	{
		/* 	Use a REPLACE statement to:
			- insert a new row with the session id, if it doesn't exist, or...
			- update the row having the session id, if it does exist.
		*/
		$query = 'REPLACE INTO '.$schema.'.sessions (session_id, account_id, login_time) VALUES (:sid, :accountId, NOW())';
		$values = array(':sid' => session_id(), ':accountId' => $this->id);
		
		/* Execute the query */
		try
		{
			$res = $pdo->prepare($query);
			$res->execute($values);
		}
		catch (PDOException $e)
		{
		   /* If there is a PDO exception, throw a standard exception */
		   throw new Exception($e->getMessage());
		}
	}
}

public function sessionLogin(): bool
{
	/* Global $pdo object */
    global $pdo;
    global $schema;
	
	/* Check that the Session has been started */
	if (session_status() == PHP_SESSION_ACTIVE)
	{
		/* 
			Query template to look for the current session ID on the account_sessions table.
			The query also make sure the Session is not older than 7 days
		*/
		$query = 'SELECT * FROM '.$schema.'.sessions, '.$schema.'.accounts WHERE (sessions.session_id = :sid) ' . 
		'AND (sessions.login_time >= (NOW() - INTERVAL 30 DAY)) AND (sessions.account_id = accounts.account_id) ' . 
		'AND (accounts.account_enabled = 1)';
		
		/* Values array for PDO */
		$values = array(':sid' => session_id());
		
		/* Execute the query */
		try
		{
			$res = $pdo->prepare($query);
			$res->execute($values);
		}
		catch (PDOException $e)
		{
		   /* If there is a PDO exception, throw a standard exception */
		   throw new Exception($e->getMessage());
		}
		
		$row = $res->fetch(PDO::FETCH_ASSOC);
		
		if (is_array($row))
		{
			/* Authentication succeeded. Set the class properties (id and name) and return TRUE*/
			$this->id = intval($row['account_id']);
			$this->group = intval($row['account_group']);
			$this->name = $row['account_name'];
			$this->email = $row['account_email'];
			$this->authenticated = TRUE;	
			return TRUE;
		}

		//daca nu e sesiune, poate e cookie
		if (!empty($_COOKIE["wrkTracker"])) {
			//exista cookie, sa vedem daca e ce trebuie
			$accountToken = $_COOKIE["wrkTracker"];

			$query = 'SELECT * FROM '.$schema.'.sessions';
			
			/* Values array for PDO */
			//$values = array(':account_token' => $accountToken);

			try
			{
				$res = $pdo->prepare($query);
				$res->execute();
			}

			catch (PDOException $e)
			{
			   /* If there is a PDO exception, throw a standard exception */
			   throw new Exception('Database query error');
			}

			//iteram prin toate sesiunile
			while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
 				$hashedToken = $row['account_token'];
 				//verificam daca se potriveste cookieul cu tokenul
 				if (password_verify($accountToken, $hashedToken)) {
 					//modificam sesiunea
 					$query = 'UPDATE '.$schema.'.sessions SET session_id = :sid WHERE account_token = :stk';
					try {
						$res = $pdo->prepare($query);
						$values = array(':sid' => session_id(), ':stk' => $hashedToken);
						$res->execute($values);
					}

					catch (PDOException $e) {
						throw new Exception($e->getMessage());
					}
					//reincercam loginul cu sesiunea noua modificata
					if ($this->sessionLogin()) {
						return TRUE;
					}
					break;
 				}
			}
		}
	}
	
	/* If we are here, the authentication failed */
	return FALSE;
}

public function saveSession() {
	
}

public function logout()
{
	/* Global $pdo object */
    global $pdo;
    global $schema;	
	
	// If there is no logged in user, do nothing 
	if (is_null($this->id))
	{
		return;
	}
	
	/* Reset the account-related properties */
	$this->id = NULL;
	$this->id = 1;
	$this->name = NULL;
	$this->email = NULL;
	$this->authenticated = FALSE;
	
	/* If there is an open Session, remove it from the account_sessions table */
	if (session_status() == PHP_SESSION_ACTIVE)
	{
		/* Delete query */
		$query = 'DELETE FROM '.$schema.'.sessions WHERE (session_id = :sid)';
		
		/* Values array for PDO */
		$values = array(':sid' => session_id());
		
		/* Execute the query */
		try
		{
			$res = $pdo->prepare($query);
			$res->execute($values);
		}
		catch (PDOException $e)
		{
		   /* If there is a PDO exception, throw a standard exception */
		   throw new Exception($e->getMessage());
		}

		if (isset($_COOKIE['wrkTracker'])) {
    		unset($_COOKIE['wrkTracker']);
    		setcookie('wrkTracker', '', time() - 3600, '/'); // empty value and old timestamp
		}
	}
}

public function isAuthenticated(): bool
{
	return $this->authenticated;
}

public function getId(): int
{
	return $this->id;
}

public function getGroup(): int
{
	return $this->group;
}


public function getName(): string
{
	return $this->name;
}

public function getEmail(): string
{
	return $this->email;
}

public function closeOtherSessions()
{
	/* Global $pdo object */
    global $pdo;
    global $schema;
	
	/* If there is no logged in user, do nothing */
	if (is_null($this->id))
	{
		return;
	}
	
	/* Check that a Session has been started */
	if (session_status() == PHP_SESSION_ACTIVE)
	{
		/* Delete all account Sessions with session_id different from the current one */
		$query = 'DELETE FROM '.$schema.'.sessions WHERE (session_id != :sid) AND (account_id = :account_id)';
		
		/* Values array for PDO */
		$values = array(':sid' => session_id(), ':account_id' => $this->id);
		
		/* Execute the query */
		try
		{
			$res = $pdo->prepare($query);
			$res->execute($values);
		}
		catch (PDOException $e)
		{
		   /* If there is a PDO exception, throw a standard exception */
		   throw new Exception($e->getMessage());
		}

		if (isset($_COOKIE['wrkTracker'])) {
    		unset($_COOKIE['wrkTracker']);
    		setcookie('wrkTracker', '', time() - 3600, '/'); // empty value and old timestamp
		}
	}
}

public function getToken($length)
{
    $genToken = "";
    $codeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    $codeAlphabet .= "abcdefghijklmnopqrstuvwxyz";
    $codeAlphabet .= "0123456789";
    $max = strlen($codeAlphabet) - 1;
    for ($i = 0; $i < $length; $i ++) {
        $genToken .= $codeAlphabet[$this->cryptoRandSecure(0, $max)];
    }
    return $genToken;
}

public function cryptoRandSecure($min, $max)
{
    $range = $max - $min;
    if ($range < 1) {
        return $min; // not so random...
    }
    $log = ceil(log($range, 2));
    $bytes = (int) ($log / 8) + 1; // length in bytes
    $bits = (int) $log + 1; // length in bits
    $filter = (int) (1 << $bits) - 1; // set all lower bits to 1
    do {
        $rnd = hexdec(bin2hex(openssl_random_pseudo_bytes($bytes)));
        $rnd = $rnd & $filter; // discard irrelevant bits
    } while ($rnd >= $range);
    return $min + $rnd;
}
}
?>